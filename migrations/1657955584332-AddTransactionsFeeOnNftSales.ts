import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactionsFeeOnNftSales1657955584332 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_sales` ADD `transactions_fee` varchar(250)  AFTER `price`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_sales` DROP COLUMN `transactions_fee`');
  }
}
