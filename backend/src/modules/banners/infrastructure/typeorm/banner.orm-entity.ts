import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('banners')
export class BannerOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ length: 255 }) title: string
  @Column({ nullable: true }) subtitle: string
  @Column({ nullable: true }) buttonText: string
  @Column({ nullable: true }) buttonLink: string
  @Column() image: string
  @Column({ nullable: true }) mobileImage: string
  @Column({ default: true }) isActive: boolean
  @Column({ default: 0 }) sortOrder: number
  @CreateDateColumn() createdAt: Date
}
