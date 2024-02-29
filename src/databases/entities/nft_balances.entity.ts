import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('nft_balances')
export class NftBalances {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'token_id' })
  tokenId: number

  @Column()
  address: string

  @Column()
  status: string
}
