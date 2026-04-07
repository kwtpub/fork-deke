import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductOrmEntity } from '../typeorm/product.orm-entity'
import type {
  IProductRepository, ProductListParams, PaginatedProducts,
} from '../../domain/repositories/product.repository.interface'

@Injectable()
export class ProductTypeormRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async findPaginated({ categorySlug, search, page = 1, limit = 12 }: ProductListParams): Promise<PaginatedProducts> {
    const qb = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.series', 'series')
      .where('p.isActive = :active', { active: true })

    if (categorySlug) qb.andWhere('category.slug = :slug', { slug: categorySlug })
    if (search) qb.andWhere('p.name ILIKE :search', { search: `%${search}%` })

    const total = await qb.clone().getCount()
    const data = await qb.skip((page - 1) * limit).take(limit).getMany()

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  findBySlug(categorySlug: string, productSlug: string): Promise<ProductOrmEntity | null> {
    return this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.series', 'series')
      .leftJoinAndSelect('series.colors', 'colors')
      .where('p.slug = :slug', { slug: productSlug })
      .andWhere('category.slug = :categorySlug', { categorySlug })
      .getOne()
  }

  findFeatured(limit = 8): Promise<ProductOrmEntity[]> {
    return this.repo.find({
      where: { isFeatured: true, isActive: true },
      relations: ['category', 'series'],
      take: limit,
    })
  }
}
