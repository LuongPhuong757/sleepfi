import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('bed_history')
export class BedHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'bed_id' })
  bedId: number

  @Column()
  efficiency: string

  @Column()
  luck: string

  @Column()
  bonus: string

  @Column()
  special: string

  @Column()
  resilience: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
