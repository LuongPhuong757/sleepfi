import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnActionHistory1659153845761 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `action_histories` ADD `nft_sale_id` int null');
        await queryRunner.query('ALTER TABLE `action_histories` ADD `lucky_box_id` int null');
        await queryRunner.query('ALTER TABLE `action_histories` ADD `nft_id` int null');
        await queryRunner.query('ALTER TABLE `action_histories` ADD `to_amount` varchar(50) null');
        await queryRunner.query('ALTER TABLE `action_histories` MODIFY COLUMN `amount` varchar(50) NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `action_histories` DROP COLUMN `nft_sale_id`');
        await queryRunner.query('ALTER TABLE `action_histories` DROP COLUMN `lucky_box_id`');
        await queryRunner.query('ALTER TABLE `action_histories` DROP COLUMN `nft_id`');
        await queryRunner.query('ALTER TABLE `action_histories` DROP COLUMN `to_amount`');
    }

}
