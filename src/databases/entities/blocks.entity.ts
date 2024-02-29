import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('blocks')
export class BlocksEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  contract: string

  @Column()
  block: number
}
