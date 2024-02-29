import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn
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
}
