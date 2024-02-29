import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('profit_wallet')
export class ProfitWallet extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column()
  symbol: string

  @Column({ default: '0' })
  amount: string

  @Column({ name: 'available_amount', default: '0' })
  availableAmount: string

  @Column()
  wallet: string

  @CreateDateColumn({name: 'created_at', nullable: true})
  createdAt: Date

  @UpdateDateColumn({name: 'updated_at', nullable: true})
  updatedAt: Date
}
