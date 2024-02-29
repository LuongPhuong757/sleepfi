import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { NftAttributes } from './nft_attributes.entity'
import { Nfts } from './nfts.entity'

@Entity('nft_sales')
export class NftSales extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'nft_id' })
  nftId: number

  @Column()
  price: string

  @Column({ name: 'transactions_fee' })
  transactionsFee: string

  @Column()
  status: string

  @Column()
  symbol: string

  @OneToOne(() => Nfts)
  @JoinColumn({ name: 'nft_id' })
  nft: Nfts

  @OneToOne(() => NftAttributes, (nftAttribute) => nftAttribute.nftSale)
  @JoinColumn({ name: 'nft_id' })
  nftAttribute: NftAttributes

  @Column({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'updated_at' })
  updatedAt: Date
}
