import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nft_level_up')
export class NftLevelUp  extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bed_id' })
  bedId: number;

  @Column({ name: 'remain_time' })
  remainTime: number;

  @Column({ name: 'level_up_time' })
  levelUpTime: number;

  @Column()
  status: string;
}
