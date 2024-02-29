import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'

@Entity('user_whitelist')
export class UserWhitelist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
