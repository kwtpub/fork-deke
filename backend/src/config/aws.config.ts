import { registerAs } from '@nestjs/config'

export default registerAs('aws', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || 'us-east-1',
  s3Bucket: process.env.AWS_S3_BUCKET || '',
  cdnUrl: process.env.AWS_CDN_URL || '', // Optional: CloudFront or custom CDN URL
  endpoint: process.env.AWS_ENDPOINT || '', // Optional: For MinIO or S3-compatible services
}))
