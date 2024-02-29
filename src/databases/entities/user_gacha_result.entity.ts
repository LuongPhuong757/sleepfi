import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('user_gacha_result')
export class UserGachaResult extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'gacha_type' })
  gachaType: string

  @Column({ name: 'result' })
  result: string

  @Column({ name: 'tx_id' })
  transactionId: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date
}
