import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nft_attributes')
export class NftAttributes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nft_name' })
  nftName: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column({ name: 'nft_id' })
  nftId: number;

  @Column({ name: 'token_id' })
  tokenId: number;

  @Column({ name: 'contract_address' })
  contractAddress: string;

  @Column({ name: 'owner' })
  owner: string;

  @Column()
  type: string;

  @Column({ name: 'nft_type' })
  nftType: string;

  @Column({ name: 'jewel_type' })
  jewelType: string;

  @Column()
  correction: string;

  @Column({ name: 'item_type' })
  itemType: string;

  @Column()
  effect: string;

  @Column({ name: 'class' })
  classNft: string;

  @Column()
  quality: string;

  @Column()
  durability: number;

  @Column()
  time: number;

  @Column()
  level: number;

  @Column({ name: 'bed_mint' })
  bedMint: number;

  @Column({ name: 'is_mint' })
  isMint: number;

  @Column()
  efficiency: number;

  @Column()
  luck: number;

  @Column()
  bonus: number;

  @Column()
  special: number;

  @Column()
  resilience: number;

  @Column({ name: 'level_up_time' })
  levelUpTime: string;
}
