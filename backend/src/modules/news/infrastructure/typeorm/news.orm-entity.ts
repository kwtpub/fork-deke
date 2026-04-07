import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('news')
@Index(['slug'], { unique: true })
export class NewsOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ length: 255 }) title: string
  @Column({ unique: true, length: 255 }) slug: string
  @Column({ type: 'text' }) excerpt: string
  @Column({ type: 'text' }) content: string
  @Column({ nullable: true }) coverImage: string
  @Column({ default: true }) isPublished: boolean
  @Column({ type: 'timestamp', nullable: true }) publishedAt: Date
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
}
