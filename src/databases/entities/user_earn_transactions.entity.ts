import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('user_earn_transactions')
export class UserEarnTransactions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'hash_id' })
  hashId: string

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'tracking_id' })
  trackingId: number

  @Column({ name: 'tracking_result_id' })
  trackingResultId: number

  @Column()
  amount: string

  @Column()
  symbol: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
