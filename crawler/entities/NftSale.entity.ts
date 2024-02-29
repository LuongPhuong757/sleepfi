import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nft_sales')
export class NftSales extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'nft_id' })
    nftId: number;

    @Column()
    price: string;

    @Column()
    status: string;

    @Column()
    symbol: string;
}
