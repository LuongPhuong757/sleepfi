import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tx_widthdrawl')
export class TxWidthdrawl extends BaseEntity {
    @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tx: string;

  @Column()
  status: string;

}
