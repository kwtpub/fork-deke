import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private configService;
    private s3Client;
    private bucketName;
    private region;
    private cdnUrl?;
    private endpoint?;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder: string): Promise<{
        url: string;
        key: string;
        originalName: string;
        size: number;
    }>;
    uploadBuffer(buffer: Buffer, folder: string, fileName: string, contentType: string): Promise<{
        url: string;
        key: string;
    }>;
    deleteFile(key: string): Promise<void>;
    getPresignedUrl(key: string, expiresIn?: number): Promise<string>;
    private getPublicUrl;
    extractKeyFromUrl(url: string): string | null;
}
