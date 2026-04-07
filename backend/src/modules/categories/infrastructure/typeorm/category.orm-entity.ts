import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  CreateDateColumn, UpdateDateColumn, JoinColumn, Index,
} from 'typeorm'

@Entity('categories')
@Index(['slug'], { unique: true })
export class CategoryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255 })
  name: string

  @Column({ unique: true, length: 255 })
  slug: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  image: string

  @Column({ nullable: true })
  icon: string

  @Column({ default: 0 })
  sortOrder: number

  @Column({ nullable: true })
  parentId: string

  @ManyToOne(() => CategoryOrmEntity, (c) => c.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parentId' })
  parent: CategoryOrmEntity

  @OneToMany(() => CategoryOrmEntity, (c) => c.parent)
  children: CategoryOrmEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
