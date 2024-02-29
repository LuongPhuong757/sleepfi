import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnTxHistory1659153845762 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tx_histories` ADD `target_type` varchar(50) null');
        await queryRunner.query('ALTER TABLE `tx_histories` ADD `nft_sale_id` int null');
        await queryRunner.query('ALTER TABLE `tx_histories` ADD `lucky_box_id` int null');
        await queryRunner.query('ALTER TABLE `tx_histories` ADD `nft_id` int null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tx_histories` DROP COLUMN `nft_sale_id`');
        await queryRunner.query('ALTER TABLE `tx_histories` DROP COLUMN `target_type`');
        await queryRunner.query('ALTER TABLE `tx_histories` DROP COLUMN `lucky_box_id`');
        await queryRunner.query('ALTER TABLE `tx_histories` DROP COLUMN `nft_id`');
    }

}
