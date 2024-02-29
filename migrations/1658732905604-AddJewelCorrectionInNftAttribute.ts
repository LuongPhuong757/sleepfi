import {MigrationInterface, QueryRunner} from "typeorm";

export class AddJewelCorrectionInNftAttribute1658732905604 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nft_attributes` add jewel_correction varchar(255) null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN jewel_correction');
    }

}
