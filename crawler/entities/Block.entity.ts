import {BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity({ name: 'blocks' })
export class Block extends BaseEntity {
  @PrimaryColumn({name: 'block_id'})
  blockId: string;

  @Column()
  contract: string;

  @Column({name: 'from_block'})
  fromBlock: number;

  @Column()
  block: number;
}
