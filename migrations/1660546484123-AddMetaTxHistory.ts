import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMetaTxHistory1660546484123 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tx_histories` ADD `meta_data` varchar(500) null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tx_histories` DROP COLUMN `meta_data`');
    }

}
