import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { CATEGORY_REPOSITORY } from '../../../domain/repositories/category.repository.interface'
import type { ICategoryRepository } from '../../../domain/repositories/category.repository.interface'

@Injectable()
export class GetCategoryBySlugUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(slug: string) {
    const category = await this.categoryRepo.findBySlug(slug)
    if (!category) throw new NotFoundException(`Категория '${slug}' не найдена`)
    return category
  }
}
