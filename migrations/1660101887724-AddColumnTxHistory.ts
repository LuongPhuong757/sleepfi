import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnTxHistory1660101887724 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tx_histories` ADD `before_balance` varchar(50) null');
        await queryRunner.query('ALTER TABLE `tx_histories` ADD `current_balance` varchar(50) null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tx_histories` DROP COLUMN `before_balance`');
        await queryRunner.query('ALTER TABLE `tx_histories` DROP COLUMN `current_balance`');
    }

}
