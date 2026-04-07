import { S3Service } from '../../../../shared/s3/s3.service';
export declare class UploadController {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    uploadFile(folder: string, file: Express.Multer.File): Promise<{
        url: string;
        key: string;
        originalName: string;
        size: number;
    }>;
}
