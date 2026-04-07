import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum OrderStatus { NEW = 'new', IN_PROGRESS = 'in_progress', DONE = 'done', CANCELLED = 'cancelled' }
export enum OrderType { CALLBACK = 'callback', CONSULTATION = 'consultation', ORDER = 'order' }

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ type: 'enum', enum: OrderType, default: OrderType.CALLBACK }) type: OrderType
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.NEW }) status: OrderStatus
  @Column({ length: 255 }) name: string
  @Column({ length: 20 }) phone: string
  @Column({ nullable: true }) email: string
  @Column({ type: 'text', nullable: true }) message: string
  @Column({ nullable: true }) productId: string
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
}
