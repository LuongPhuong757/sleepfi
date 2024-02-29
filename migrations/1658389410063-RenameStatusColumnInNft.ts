import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameStatusColumnInNft1658389410063 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nfts` CHANGE `status` `nft_status` varchar(255)'); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nfts` DROP COLUMN nft_status');
    }

}
