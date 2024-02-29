import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('user_gacha_info')
export class UserGachaInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'special_times' })
  specialTimes: number

  @Column({ name: 'common_times' })
  commonTimes: number

  @Column({ name: 't_special_times' })
  totalSpecialTimes: number

  @Column({ name: 't_common_times' })
  totalCommonTimes: number

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date
}
