import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, Index,
} from 'typeorm'
import { CategoryOrmEntity } from '../../../categories/infrastructure/typeorm/category.orm-entity'
import { ProductSeriesOrmEntity } from './product-series.orm-entity'

@Entity('products')
@Index(['slug'], { unique: true })
@Index(['categoryId'])
export class ProductOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255 })
  name: string

  @Column({ unique: true, length: 255 })
  slug: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'simple-array', default: '' })
  images: string[]

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceFrom: number

  @Column({ default: true })
  isActive: boolean

  @Column({ default: false })
  isFeatured: boolean

  @Column({ type: 'jsonb', default: {} })
  specifications: Record<string, string>

  @Column({ nullable: true })
  categoryId: string

  @ManyToOne(() => CategoryOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryOrmEntity

  @OneToMany(() => ProductSeriesOrmEntity, (s) => s.product, { cascade: true })
  series: ProductSeriesOrmEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
