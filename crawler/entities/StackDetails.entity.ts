import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'stack_details' })
export class StackDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'stack_campaign_id' })
  stackCampaignId: number;

  @Column({ name: 'stake_token' })
  stakeToken: string;

  @Column()
  amount: string;

  @Column({ name: 'is_lock' })
  isLock: number;

  @Column()
  reward: string;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'reward_time' })
  rewardTime: string;

  @Column({ name: 'lock_time' })
  lockTime: string;

  @Column({ name: 'status_stacking' })
  statusStacking: string;

  @Column()
  status: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
