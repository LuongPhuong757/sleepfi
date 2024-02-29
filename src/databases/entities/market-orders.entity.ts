import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('market_orders')
export class MarketOrders extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  symbol: string

  @Column({ default: '0' })
  amount: string

  @Column()
  fee: string

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'nft_id' })
  nftId: number

  @Column()
  status: string

  @Column({ name: 'msg_error' })
  msgError: string

  @Column({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'updated_at' })
  updatedAt: Date
}
