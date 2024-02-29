import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWalletAndAddressTokenColumnOnSpendingBalances1656648226521
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `spending_balances` ADD `wallet` varchar(255) DEFAULT NULL AFTER `available_amount` , ADD `token_address` varchar(255) DEFAULT NULL AFTER `available_amount`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `spending_balances` DROP COLUMN wallet, DROP COLUMN token_address;',
    );
  }
}
