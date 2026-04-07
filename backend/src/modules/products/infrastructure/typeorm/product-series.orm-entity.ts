import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  OneToMany, JoinColumn, Index,
} from 'typeorm'
import { ProductOrmEntity } from './product.orm-entity'
import { ProductColorOrmEntity } from './product-color.orm-entity'

@Entity('product_series')
@Index(['slug'])
export class ProductSeriesOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255 })
  name: string

  @Column({ length: 255 })
  slug: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  coverImage: string

  @Column({ type: 'jsonb', default: [] })
  specs: Array<{ key: string; label: string; value: string; unit?: string }>

  @Column()
  productId: string

  @ManyToOne(() => ProductOrmEntity, (p) => p.series, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: ProductOrmEntity

  @OneToMany(() => ProductColorOrmEntity, (c) => c.series, { cascade: true })
  colors: ProductColorOrmEntity[]
}
