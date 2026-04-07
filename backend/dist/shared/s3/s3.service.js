"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto_1 = require("crypto");
const path_1 = require("path");
let S3Service = class S3Service {
    configService;
    s3Client;
    bucketName;
    region;
    cdnUrl;
    endpoint;
    constructor(configService) {
        this.configService = configService;
        this.region = this.configService.get('aws.region', 'us-east-1');
        this.bucketName = this.configService.get('aws.s3Bucket', '');
        this.cdnUrl = this.configService.get('aws.cdnUrl');
        this.endpoint = this.configService.get('aws.endpoint');
        const accessKeyId = this.configService.get('aws.accessKeyId');
        const secretAccessKey = this.configService.get('aws.secretAccessKey');
        if (!accessKeyId || !secretAccessKey) {
            console.warn('⚠️  AWS credentials not configured. S3 upload will not work.');
            return;
        }
        const s3Config = {
            region: this.region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        };
        if (this.endpoint) {
            s3Config.endpoint = this.endpoint;
            s3Config.forcePathStyle = true;
        }
        this.s3Client = new client_s3_1.S3Client(s3Config);
        const storageType = this.endpoint ? `MinIO (${this.endpoint})` : 'AWS S3';
        console.log(`✅ S3 Service initialized: ${storageType}, bucket=${this.bucketName}, region=${this.region}`);
    }
    async uploadFile(file, folder) {
        const fileExt = (0, path_1.extname)(file.originalname);
        const fileName = `${(0, crypto_1.randomUUID)()}${fileExt}`;
        const key = `${folder}/${fileName}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });
        await this.s3Client.send(command);
        const url = this.getPublicUrl(key);
        return {
            url,
            key,
            originalName: file.originalname,
            size: file.size,
        };
    }
    async uploadBuffer(buffer, folder, fileName, contentType) {
        const key = `${folder}/${fileName}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            ACL: 'public-read',
        });
        await this.s3Client.send(command);
        const url = this.getPublicUrl(key);
        return { url, key };
    }
    async deleteFile(key) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.s3Client.send(command);
    }
    async getPresignedUrl(key, expiresIn = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
    }
    getPublicUrl(key) {
        if (this.cdnUrl) {
            return `${this.cdnUrl}/${key}`;
        }
        if (this.endpoint) {
            return `${this.endpoint}/${this.bucketName}/${key}`;
        }
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }
    extractKeyFromUrl(url) {
        try {
            if (this.cdnUrl && url.startsWith(this.cdnUrl)) {
                return url.replace(`${this.cdnUrl}/`, '');
            }
            if (this.endpoint && url.startsWith(this.endpoint)) {
                const pattern = new RegExp(`${this.endpoint}/${this.bucketName}/(.+)`);
                const match = url.match(pattern);
                return match ? match[1] : null;
            }
            const s3Pattern = new RegExp(`https://${this.bucketName}\\.s3\\.${this.region}\\.amazonaws\\.com/(.+)`);
            const match = url.match(s3Pattern);
            return match ? match[1] : null;
        }
        catch {
            return null;
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map