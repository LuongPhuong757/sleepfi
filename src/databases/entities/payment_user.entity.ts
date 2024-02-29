import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('payment_user_info')
export class PaymentUserInfo extends BaseEntity {
  @PrimaryColumn({ name: 'hash_id' })
  hashId: string

  @PrimaryColumn({ name: 'reservation' })
  reservation: string

  @PrimaryColumn({ name: 'order_id' })
  orderId: string

  @PrimaryColumn({ name: 'email' })
  email: string

  @PrimaryColumn({ name: 'user_id' })
  userId: number

  @PrimaryColumn({ name: 'wallet' })
  wallet: string

  @PrimaryColumn({ name: 'tx' })
  tx: string

  @PrimaryColumn({ name: 'amount' })
  amount: number

  @PrimaryColumn({ name: 'order_status' })
  orderStatus: string

  @PrimaryColumn({ name: 'status' })
  status: string

  @Column({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'updated_at' })
  updatedAt: Date
}
