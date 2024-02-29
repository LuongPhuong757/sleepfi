import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('profit_history')
export class ProfitHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: string

  @Column()
  symbol: string

  @Column({ name: 'user_id' })
  userId: number

  @Column({ default: '0' })
  amount: string

  @CreateDateColumn({name: 'created_at', nullable: true})
  createdAt: Date

  @UpdateDateColumn({name: 'updated_at', nullable: true})
  updatedAt: Date
}
