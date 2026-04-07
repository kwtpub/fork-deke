import {
  Controller, Post, UseInterceptors, UploadedFile,
  UseGuards, Param, BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard'
import { S3Service } from '../../../../shared/s3/s3.service'

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post(':folder')
  @ApiOperation({ summary: 'Загрузить файл в S3 (требуется авторизация)' })
  @ApiParam({ name: 'folder', example: 'products', description: 'Папка: products | banners | categories | news | docs' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('folder') folder: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Файл не передан')
    const allowedFolders = ['products', 'banners', 'categories', 'news', 'docs', 'misc']
    if (!allowedFolders.includes(folder)) throw new BadRequestException('Неверная папка')

    const result = await this.s3Service.uploadFile(file, folder)
    return result
  }
}
