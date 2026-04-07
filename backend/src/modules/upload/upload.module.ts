import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { UploadController } from './presentation/controllers/upload.controller'
import { S3Module } from '../../shared/s3/s3.module'

@Module({
  imports: [
    MulterModule.register({
      storage: require('multer').memoryStorage(), // Use memory storage for S3
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|webp|gif|pdf)$/i
        if (!allowed.test(file.originalname)) {
          return cb(new Error('Недопустимый тип файла'), false)
        }
        cb(null, true)
      },
    }),
    S3Module,
  ],
  controllers: [UploadController],
})
export class UploadModule {}

