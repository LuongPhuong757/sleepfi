import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('spending_balances')
export class SpendingBalances extends BaseEntity {
  @PrimaryColumn({ name: 'wallet_id' })
  walletId: string

  @Column()
  symbol: string

  @Column({ default: '0' })
  amount: string

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'available_amount', default: '0' })
  availableAmount: string

  @Column({ name: 'max_amount' })
  maxAmount: string

  @Column()
  wallet: string

  @Column({ name: 'token_address' })
  tokenAddress: string

  @CreateDateColumn({name: 'created_at', nullable: true})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at', nullable: true})
  updatedAt: Date;
}
