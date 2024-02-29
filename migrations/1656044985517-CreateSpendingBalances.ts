import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpendingBalances1656044985517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `spending_balances` ( ' +
      '`wallet_id` varchar(200) NOT NULL, ' +
      '`symbol` varchar(200) NOT NULL,' +
      '`amount` varchar(200) DEFAULT 0, ' +
      '`user_id` int NOT NULL,' +
      '`available_amount` varchar(200) DEFAULT 0,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`wallet_id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `spending_balances`');
  }
}
