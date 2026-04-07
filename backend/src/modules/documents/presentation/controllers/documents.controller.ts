import { Controller, Get, Post, Patch, Delete, Query, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { DocumentOrmEntity, DocumentType } from '../../infrastructure/typeorm/document.orm-entity'
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard'

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(
    @InjectRepository(DocumentOrmEntity)
    private readonly repo: Repository<DocumentOrmEntity>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список документов' })
  findAll(@Query('type') type?: DocumentType) {
    const where: Record<string, unknown> = { isPublished: true }
    if (type) where.type = type
    return this.repo.find({ where, order: { createdAt: 'DESC' } })
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать документ [Admin]' })
  create(@Body() body: Partial<DocumentOrmEntity>) {
    return this.repo.save(this.repo.create(body))
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить документ [Admin]' })
  async update(@Param('id') id: string, @Body() body: Partial<DocumentOrmEntity>) {
    await this.repo.update(id, body)
    return this.repo.findOneByOrFail({ id })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить документ [Admin]' })
  async remove(@Param('id') id: string) {
    await this.repo.delete(id)
  }
}
