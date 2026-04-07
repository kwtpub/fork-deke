import { Module } from '@nestjs/common'
import { SearchController } from './presentation/controllers/search.controller'

@Module({ controllers: [SearchController] })
export class SearchModule {}
