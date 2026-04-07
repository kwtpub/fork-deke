import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NewsOrmEntity } from '../typeorm/news.orm-entity'
import type { INewsRepository } from '../../domain/repositories/news.repository.interface'

@Injectable()
export class NewsTypeormRepository implements INewsRepository {
  constructor(@InjectRepository(NewsOrmEntity) private readonly repo: Repository<NewsOrmEntity>) {}

  async findPaginated(page: number, limit: number) {
    const [data, total] = await this.repo.findAndCount({
      where: { isPublished: true },
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit, take: limit,
    })
    return { data, total }
  }

  findBySlug(slug: string) {
    return this.repo.findOne({ where: { slug, isPublished: true } })
  }
}
