import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { WITHDRAW_STATUS } from '../../withdraw/constants'

@Entity('bed_point')
export class Poins extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // @Column({ name: 'user_id' })
  // userId: number

  @Column({ name: 'bed_id' })
  bedId: number

  @Column({ name: 'bed_point' })
  bedPoint: number

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
