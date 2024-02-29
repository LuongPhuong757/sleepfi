import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Category } from './categories.entity'
import { NftAttributes } from './nft_attributes.entity'
import { NftLevelUp } from './nft_level_up.entity'
import { NftSales } from './nft_sales.entity'

@Entity('nfts')
export class Nfts extends BaseEntity {
  @ApiProperty({
    example: '1'
  })
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'category_id' })
  @ApiProperty({
    example: '1'
  })
  categoryId: number

  @Column({ name: 'is_lock' })
  @ApiProperty({
    example: '1'
  })
  isLock: number

  @Column({ name: 'nft_status' })
  @ApiProperty({
    example: '1'
  })
  status: string

  @ApiProperty({ type: () => NftAttributes })
  @OneToOne(() => NftAttributes, (nftAttribute) => nftAttribute.nft)
  attribute: NftAttributes

  @ApiProperty({ type: () => NftSales })
  @OneToOne(() => NftSales, (nftSale) => nftSale.nft)
  sales: NftSales

  @ApiProperty({ type: () => NftLevelUp })
  @OneToOne(() => NftLevelUp, (nftLevelUp) => nftLevelUp.nft)
  levelUp: NftLevelUp

  @OneToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category
}
