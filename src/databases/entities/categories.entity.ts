import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Nfts } from './nfts.entity'

@Entity('nft_categories')
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number

  @ApiProperty()
  @Column({ name: 'name', type: 'varchar', length: '255' })
  name: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date

  @ApiProperty({ type: () => Nfts })
  @OneToOne(() => Nfts, (item) => item.category)
  nft: Nfts
}
