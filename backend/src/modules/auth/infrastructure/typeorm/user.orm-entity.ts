import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'

export enum UserRole { ADMIN = 'admin', MANAGER = 'manager' }

@Entity('users')
@Index(['email'], { unique: true })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255, unique: true })
  email: string

  @Column({ length: 255 })
  passwordHash: string

  @Column({ length: 100, nullable: true })
  name: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MANAGER })
  role: UserRole

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
