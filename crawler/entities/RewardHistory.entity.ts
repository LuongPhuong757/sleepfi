import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('reward_history')
export class RewardHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tvl: string;

  @Column({ name: 'reward_time' })
  rewardTime: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

}

