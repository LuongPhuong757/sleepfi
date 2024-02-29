import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnSymbolInNftSalesTable1656574427985 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `nft_sales` ADD `symbol` varchar(255) NOT NULL AFTER `status`'
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nft_sales` DROP COLUMN `symbol`');
    }

}
