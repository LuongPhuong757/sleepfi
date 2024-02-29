import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { STATUS_TRACKING } from '../../tracking/constants'

@Entity('tracking')
export class Tracking {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'bed_type' })
  bedType: string

  @Column()
  alrm: boolean

  @Column({ name: 'start_sleep' })
  startSleep: string

  @Column({ name: 'wake_up' })
  wakeUp: string

  @Column({ name: 'hash_id', nullable: true })
  hashId: string

  @Column({ name: 'bed_used' })
  bedUsed: number

  @Column({ name: 'item_used', nullable: true })
  itemUsed: number

  @Column({ name: 'time_sleep', nullable: true })
  timeSleep: number

  @Column()
  efficiency: string

  @Column()
  luck: string

  @Column()
  bonus: string

  @Column()
  special: string

  @Column()
  resilience: string

  @Column({ name: 'items_level' })
  itemLevel: number

  @Column({ name: 'bed_level' })
  bedLevel: number

  @Column({ name: 'enable_insurance' })
  enableInsurance: boolean

  @Column()
  insurance: string

  @Column()
  year: number

  @Column({ name: 'est_earn' })
  estEarn: string

  @Column({ name: 'actual_earn' })
  actualEarn: string

  @Column({ name: 'time_range' })
  timeRange: string

  @Column()
  month: number

  @Column()
  quality: number

  @Column()
  day: number

  @Column()
  status: STATUS_TRACKING

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
