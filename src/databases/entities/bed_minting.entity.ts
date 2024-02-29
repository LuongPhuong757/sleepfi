import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('bed_minting')
export class BedMintings extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number

  @ApiProperty()
  @Column({ name: 'bed_id' })
  bedId: number

  @ApiProperty()
  @Column({ name: 'waiting_time' })
  waitingTime: string

  @ApiProperty()
  @Column({ name: 'minted_number' })
  mintedNumber: number

  @ApiProperty()
  @Column({ name: 'max_minting' })
  maxMinting: number

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
