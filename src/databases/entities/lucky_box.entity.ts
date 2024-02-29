import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { PATH_IMG } from '../../../crawler/constants/attributes'

@Entity('lucky_box')
export class LuckyBox extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column()
  level: number

  @Column({ name: 'waiting_time' })
  waitingTime: string

  @Column({ name: 'speed_up_cost' })
  speedUpCost: string

  @Column({ name: 'redraw_rate' })
  redrawRate: string

  @Column({ name: 'opening_cost' })
  openingCost: string

  @Column({ name: 'type_gift' })
  typeGift: string

  @Column()
  symbol: string

  @Column()
  amount: string

  @Column({ name: 'nft_id' })
  nftId: number

  @Column({ name: 'is_open' })
  isOpen: number

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date

  @Column({ name: 'image', nullable: true })
  image: string

  @AfterLoad()
  formatBaseUrlImage() {
    this.image = `${PATH_IMG['luckybox']}${this.image}`
  }
}
