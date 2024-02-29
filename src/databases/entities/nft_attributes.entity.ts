import { ApiProperty } from '@nestjs/swagger'
import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { PATH_IMG } from '../../../crawler/constants/attributes'
import {
  getPercentItemLevel,
  getPercentJewelLevel
} from '../../master-data/constants'
import { NftSales } from './nft_sales.entity'
import { Nfts } from './nfts.entity'
import { User } from './user.entity';

@Entity('nft_attributes')
export class NftAttributes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'nft_id' })
  nftId: number

  @Column({ name: 'nft_name' })
  nftName: string

  @Column()
  name: string

  @Column({ name: 'parent_1' })
  parent1: number

  @Column({ name: 'parent_2' })
  parent2: number

  @ApiProperty()
  @Column({ name: 'contract_address' })
  contractAddress: string

  @ApiProperty({
    example: '1'
  })
  @Column({ name: 'token_id' })
  tokenId: number

  @ApiProperty()
  @Column({ name: 'owner' })
  owner: string

  @ApiProperty({
    example: '1'
  })
  @Column()
  type: string

  @Column({ name: 'nft_type' })
  nftType: string

  @Column({ name: 'jewel_type' })
  jewelType: string

  @Column({ name: 'item_type' })
  itemType: string

  @ApiProperty()
  @Column({ name: 'class' })
  classNft: string

  @ApiProperty()
  @Column({ name: 'effect' })
  effect: string

  @ApiProperty({
    example: '1'
  })
  @Column()
  quality: string

  @Column()
  image: string

  @ApiProperty({
    example: '1'
  })
  @Column()
  time: number

  @ApiProperty({
    example: '1'
  })
  @Column()
  level: number

  @Column({ name: 'level_up_time' })
  levelUpTime: string

  @ApiProperty({
    example: '1'
  })
  @Column({ name: 'bed_mint' })
  bedMint: number

  @Column({ name: 'is_mint' })
  isMint: number

  @Column({ name: 'is_burn' })
  isBurn: number

  @ApiProperty({
    example: '1'
  })
  @Column()
  efficiency: number

  @ApiProperty({
    example: 100
  })
  @Column()
  durability: number

  @ApiProperty({
    example: '1'
  })
  @Column()
  luck: number

  @ApiProperty({
    example: '1'
  })
  @Column()
  bonus: number

  percentEffect: number

  @ApiProperty({
    example: '1'
  })
  @Column()
  special: number

  @ApiProperty({
    example: '1'
  })
  @Column()
  resilience: number

  @Column({ name: 'correction' })
  jewelCorrection: string

  @Column({ name: 'created_at' })
  createdAt: string

  @Column({ name: 'updated_at' })
  updatedAt: Date

  @OneToOne(() => Nfts)
  @JoinColumn({ name: 'nft_id' })
  nft: Nfts

  @OneToOne(() => NftSales, (nftSale) => nftSale.nftAttribute)
  @JoinColumn({ name: 'nft_id' })
  nftSale: NftSales

  @AfterLoad()
  formatBaseUrlImage() {
    this.image = `${PATH_IMG[this.nftType]}${this.image}`
  }

  @AfterLoad()
  percentEffectForItem() {
    if (this.nftType === 'item') {
      this.percentEffect = getPercentItemLevel(this.level)
    } else if (this.nftType === 'jewel') {
      this.percentEffect = getPercentJewelLevel(this.level)
    }
  }

  @ManyToOne(() => User, (user) => user.attributes, {
    eager: true,
  })
  @JoinColumn({ name: 'owner', referencedColumnName: 'wallet' })
  author: User
}
