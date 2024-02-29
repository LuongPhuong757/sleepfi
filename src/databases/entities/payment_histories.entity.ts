import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('payment_histories')
export class PaymentHistories extends BaseEntity {
  @PrimaryColumn({ name: 'hash_id' })
  hashId: string

  @PrimaryColumn({ name: 'reservation' })
  reservation: string

  @PrimaryColumn({ name: 'email' })
  email: string

  @PrimaryColumn({ name: 'order_id' })
  orderId: string

  @PrimaryColumn({ name: 'order_status' })
  orderStatus: string

  @PrimaryColumn({ name: 'transfer_id' })
  transferId: string

  @PrimaryColumn({ name: 'result_info' })
  resultInfo: string

  @Column({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'updated_at' })
  updatedAt: Date
}
