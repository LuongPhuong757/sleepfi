import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('stack_campaigns')
export class StackCampaigns extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'reward_token' })
  rewardToken: string

  @Column({ name: 'stake_token' })
  stakeToken: string

  @Column({ name: 'penalty_rate' })
  penaltyRate: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
