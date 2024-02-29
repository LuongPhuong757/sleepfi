import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('staking')
export class Stakes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  tvl: string

  @Column({ name: 'available_total_stake' })
  availableTotalStake: string

  @Column({ name: 'total_stake_allocation' })
  totalStakeAllocation: string

  @Column({ name: 'reward_time' })
  rewardTime: string

  @Column({ default: 'pending' })
  status: string

  @Column({ name: 'end_time_campaign' })
  endTimeCampaign: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
