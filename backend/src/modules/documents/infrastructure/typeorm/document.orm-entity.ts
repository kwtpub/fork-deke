import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export enum DocumentType { CERTIFICATE = 'certificate', INSTRUCTION = 'instruction', TECHNICAL = 'technical' }

@Entity('documents')
export class DocumentOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ length: 255 }) name: string
  @Column() fileUrl: string
  @Column({ nullable: true }) thumbnailUrl: string
  @Column({ type: 'enum', enum: DocumentType, default: DocumentType.INSTRUCTION }) type: DocumentType
  @Column({ nullable: true }) categoryId: string
  @Column({ default: true }) isPublished: boolean
  @CreateDateColumn() createdAt: Date
}
