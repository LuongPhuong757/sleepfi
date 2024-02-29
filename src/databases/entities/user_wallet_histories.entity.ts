import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('user_wallet_histories')
export class UserWalletHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id', type: 'int' })
  userId: number

  @Column({ name: 'old_wallet' })
  oldWallet: string

  @Column({ name: 'new_wallet' })
  newWallet: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
