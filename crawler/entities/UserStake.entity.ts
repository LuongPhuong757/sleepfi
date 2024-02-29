import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_stake')
export class UserStakeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total_stake' })
  totalStake: string;

  @Column({ name: 'total_reward' })
  totalReward: string;

  @Column({ name: 'earning_token' })
  earningToken: string;

  @Column({ name: 'minting_discount' })
  mintingDiscount: string;

  @Column({ name: 'level_up_discount' })
  levelUpDiscount: string;

  @Column()
  symbol: string;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
