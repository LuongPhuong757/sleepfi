import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('tracking_result')
export class TrackingResult {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'hash_id' })
  hashId: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'tracking_id' })
  trackingId: number

  @Column({ name: 'bed_time' })
  bedTime: string

  @Column({ name: 'sleep_onset_time' })
  sleepOnsetTime: string

  @Column({ name: 'woke_up_time' })
  wokeUpTime: string

  @Column({ name: 'n_awk' })
  nAwk: number

  @Column({ name: 'sleep_duration_time' })
  sleepDurationTime: string

  @Column({ name: 'sleep_quality' })
  sleepQuality: number

  @Column({ name: 'actual_earn' })
  actualEarn: string

  @Column({ name: 'token_earn_symbol' })
  tokenEarnSymbol: string

  @Column({ name: 'date_time' })
  dateTime: string

  @Column()
  day: string

  @Column()
  month: string

  @Column()
  year: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date

  @Column({ name: 'start_sleep_time' })
  startSleepTime: number

  @Column({ name: 'time_in_bed' })
  timeInBed: number
}
