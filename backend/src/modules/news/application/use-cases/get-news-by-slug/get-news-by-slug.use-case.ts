import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { NEWS_REPOSITORY } from '../../../domain/repositories/news.repository.interface'
import type { INewsRepository } from '../../../domain/repositories/news.repository.interface'

@Injectable()
export class GetNewsBySlugUseCase {
  constructor(@Inject(NEWS_REPOSITORY) private readonly newsRepo: INewsRepository) {}
  async execute(slug: string) {
    const news = await this.newsRepo.findBySlug(slug)
    if (!news) throw new NotFoundException('Новость не найдена')
    return news
  }
}
