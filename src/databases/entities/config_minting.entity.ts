import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('config_minting')
export class ConfigMinting extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number

  @ApiProperty()
  @Column()
  level: number

  @ApiProperty()
  @Column({ name: 'minting_number' })
  mintingNumber: number

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
