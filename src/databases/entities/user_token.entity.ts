import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('user_token')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'token', type: 'varchar' })
  token: string

  @Column({ name: 'user_id', type: 'int' })
  userId: number

  @Column({ name: 'device_id', type: 'varchar' })
  deviceId: string

  @Column({ name: 'expired_in', type: 'int' })
  expiredIn: number

  @Column({ name: 'is_valid' })
  isValid: boolean

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
