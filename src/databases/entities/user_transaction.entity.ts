import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('user_transaction')
export class UserTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  type: string

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'nft_id' })
  nftId: number

  @Column({ name: 'point_minted' })
  pointMinted: number

  @Column({ name: 'point_add' })
  pointAdd: number

  @Column({ name: 'minted_number' })
  mintedNumber: number

  @Column({ name: 'max_minting' })
  maxMinting: number

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date
}
