import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { DocumentOrmEntity } from './infrastructure/typeorm/document.orm-entity'
import { DocumentsController } from './presentation/controllers/documents.controller'

@Module({
  imports: [TypeOrmModule.forFeature([DocumentOrmEntity]), AuthModule],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
