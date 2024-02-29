import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('withdraws')
export class Withdraw extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column({ name: 'contract_address' })
    contractAddress: string;

    @Column({ name: 'token_id' })
    tokenId: string;

    @Column({name:'token_address'})
    tokenAddress: string;

    @Column()
    amount: string;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'main_wallet' })
    mainWallet: string;

    @Column()
    status: string;

    @Column({ name: 'tx_hash' })
    txHash: string;

    @CreateDateColumn({ name: 'created_at', nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: Date;

}
