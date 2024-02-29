import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tx_widthdrawl')
export class TxWidthdrawl {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  tx: string

  @Column()
  status: string
}
