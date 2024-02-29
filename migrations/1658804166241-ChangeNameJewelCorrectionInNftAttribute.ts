import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeNameJewelCorrectionInNftAttribute1658804166241 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nft_attributes` CHANGE jewel_correction correction varchar(255) null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN jewel_correction');
    }

}
