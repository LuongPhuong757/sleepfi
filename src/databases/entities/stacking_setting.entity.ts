import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('stacking_setting')
export class StackingSetting extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'earning_tokens' })
  earningTokens: string

  @Column({ name: 'minting_discount' })
  mintingDiscount: string

  @Column({ name: 'level_up_discount' })
  levelUpDiscount: string
}
