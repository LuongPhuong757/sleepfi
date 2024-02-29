import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Nfts } from './nfts.entity'

@Entity('nft_level_up')
export class NftLevelUp extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'bed_id' })
  bedId: number

  @Column({ name: 'remain_time' })
  remainTime: number

  @Column({ name: 'level_up_time' })
  levelUpTime: number

  @Column()
  status: string

  @OneToOne(() => Nfts)
  @JoinColumn({ name: 'bed_id' })
  nft: Nfts
}
