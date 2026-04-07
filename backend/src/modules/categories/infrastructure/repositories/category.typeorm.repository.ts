import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoryOrmEntity } from '../typeorm/category.orm-entity'
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface'

@Injectable()
export class CategoryTypeormRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repo: Repository<CategoryOrmEntity>,
  ) {}

  findTree(): Promise<CategoryOrmEntity[]> {
    return this.repo.find({
      where: { parentId: undefined },
      relations: ['children'],
      order: { sortOrder: 'ASC' },
    })
  }

  findBySlug(slug: string): Promise<CategoryOrmEntity | null> {
    return this.repo.findOne({
      where: { slug },
      relations: ['children', 'parent'],
    })
  }

  findAll(): Promise<CategoryOrmEntity[]> {
    return this.repo.find({ order: { sortOrder: 'ASC' } })
  }
}
