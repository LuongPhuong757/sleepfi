import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { PATH_IMG } from '../../../crawler/constants/attributes'
import { NftSales } from './nft_sales.entity'

@Entity('tx_histories')
export class TxHistories extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column()
  symbol: string

  @Column({ name: 'token_address' })
  tokenAddress: string

  @Column()
  amount: string

  @Column({ name: 'token_id' })
  tokenId: string

  @Column({ name: 'contract_address' })
  contractAddress: string

  @Column()
  type: string

  @Column()
  tx: string

  @Column()
  status: string

  @Column({ name: 'nft_sale_id' })
  nftSaleId: number

  @Column({ name: 'lucky_box_id' })
  luckyBoxId: number

  @Column({ name: 'nft_id' })
  nftId: number

  @Column({ name: 'target_type' })
  targetType: string

  @Column()
  insurance: string

  @Column({ name: 'current_balance' })
  currentBalance: string

  @Column({ name: 'before_balance' })
  beforeBalance: string

  @Column({ name: 'meta_data' })
  metaData: string

  @OneToOne(() => NftSales)
  @JoinColumn({ name: 'nft_sale_id' })
  nftSale: NftSales

  @AfterLoad()
  parseMetaData(): void {
    this.metaData = JSON.parse(this.metaData)
  }

  @Column({ name: 'created_at' })
  createdAt: Date
}
