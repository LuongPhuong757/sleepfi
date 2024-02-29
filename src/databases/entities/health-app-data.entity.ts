import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('health_app_data')
export class HealthAppData extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number

  @ApiProperty()
  @Column()
  owner: string

  @ApiProperty()
  @Column({ name: 'hash_id' })
  hashId: string

  @ApiProperty()
  @Column({ name: 'tracking_id' })
  trackingId: number

  @ApiProperty()
  @Column({ name: 'data_type' })
  dataType: string

  @ApiProperty()
  @Column()
  value: string

  @ApiProperty()
  @Column({ name: 'platform_type' })
  platformType: string

  @ApiProperty()
  @Column()
  unit: string

  @ApiProperty()
  @Column({ name: 'date_from' })
  dateFrom: Date

  @ApiProperty()
  @Column({ name: 'date_to' })
  dateTo: Date

  @ApiProperty()
  @Column({ name: 'source_name' })
  sourceName: string

  @ApiProperty()
  @Column({ name: 'source_id' })
  sourceId: string

  @ApiProperty()
  @Column()
  year: number

  @ApiProperty()
  @Column()
  month: number

  @ApiProperty()
  @Column()
  day: number

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
