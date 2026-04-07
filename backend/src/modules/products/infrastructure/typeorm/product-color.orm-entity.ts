import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { ProductSeriesOrmEntity } from './product-series.orm-entity'

@Entity('product_colors')
export class ProductColorOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  name: string

  @Column({ length: 20 })
  hex: string

  @Column({ nullable: true })
  image: string

  @Column()
  seriesId: string

  @ManyToOne(() => ProductSeriesOrmEntity, (s) => s.colors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seriesId' })
  series: ProductSeriesOrmEntity
}
