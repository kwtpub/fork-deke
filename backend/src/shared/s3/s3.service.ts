import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { extname } from 'path'

@Injectable()
export class S3Service {
  private s3Client: S3Client
  private bucketName: string
  private region: string
  private cdnUrl?: string
  private endpoint?: string

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('aws.region', 'us-east-1')
    this.bucketName = this.configService.get<string>('aws.s3Bucket', '')
    this.cdnUrl = this.configService.get<string>('aws.cdnUrl')
    this.endpoint = this.configService.get<string>('aws.endpoint')

    const accessKeyId = this.configService.get<string>('aws.accessKeyId')
    const secretAccessKey = this.configService.get<string>('aws.secretAccessKey')

    if (!accessKeyId || !secretAccessKey) {
      console.warn('⚠️  AWS credentials not configured. S3 upload will not work.')
      return
    }

    const s3Config: any = {
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    }

    // Для MinIO или других S3-совместимых сервисов
    if (this.endpoint) {
      s3Config.endpoint = this.endpoint
      s3Config.forcePathStyle = true // Важно для MinIO
    }

    this.s3Client = new S3Client(s3Config)

    const storageType = this.endpoint ? `MinIO (${this.endpoint})` : 'AWS S3'
    console.log(`✅ S3 Service initialized: ${storageType}, bucket=${this.bucketName}, region=${this.region}`)
  }

  /**
   * Upload file to S3
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; key: string; originalName: string; size: number }> {
    const fileExt = extname(file.originalname)
    const fileName = `${randomUUID()}${fileExt}`
    const key = `${folder}/${fileName}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // или 'private' если нужен приватный доступ
    })

    await this.s3Client.send(command)

    const url = this.getPublicUrl(key)

    return {
      url,
      key,
      originalName: file.originalname,
      size: file.size,
    }
  }

  /**
   * Upload buffer to S3
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    fileName: string,
    contentType: string,
  ): Promise<{ url: string; key: string }> {
    const key = `${folder}/${fileName}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    })

    await this.s3Client.send(command)

    const url = this.getPublicUrl(key)

    return { url, key }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    await this.s3Client.send(command)
  }

  /**
   * Get presigned URL for private files
   */
  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    return getSignedUrl(this.s3Client, command, { expiresIn })
  }

  /**
   * Get public URL for a key
   */
  private getPublicUrl(key: string): string {
    // Если указан CDN URL (CloudFront)
    if (this.cdnUrl) {
      return `${this.cdnUrl}/${key}`
    }
    
    // Если используется MinIO или custom endpoint
    if (this.endpoint) {
      return `${this.endpoint}/${this.bucketName}/${key}`
    }
    
    // AWS S3 standard URL
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`
  }

  /**
   * Extract S3 key from URL
   */
  extractKeyFromUrl(url: string): string | null {
    try {
      // Handle CDN URL
      if (this.cdnUrl && url.startsWith(this.cdnUrl)) {
        return url.replace(`${this.cdnUrl}/`, '')
      }
      
      // Handle MinIO/custom endpoint URL
      if (this.endpoint && url.startsWith(this.endpoint)) {
        const pattern = new RegExp(`${this.endpoint}/${this.bucketName}/(.+)`)
        const match = url.match(pattern)
        return match ? match[1] : null
      }
      
      // Handle S3 direct URL
      const s3Pattern = new RegExp(`https://${this.bucketName}\\.s3\\.${this.region}\\.amazonaws\\.com/(.+)`)
      const match = url.match(s3Pattern)
      return match ? match[1] : null
    } catch {
      return null
    }
  }
}
