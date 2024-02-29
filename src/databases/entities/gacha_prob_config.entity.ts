import { Exclude, Transform } from 'class-transformer'
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('gacha_prob_config')
export class GachaProbConfig extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'key' })
  key: string

  @Transform(({ value }) => JSON.parse(value))
  @Column({ name: 'value' })
  value: string

  @Exclude()
  @UpdateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date
}
