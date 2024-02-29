import { MigrationInterface, QueryRunner } from "typeorm";

import profitWalletSeed from "./seeds/profit_wallet"
export class CreateProfitWallet1662522550180 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `profit_wallet` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`symbol` varchar(200) DEFAULT NULL,' +
      '`amount` varchar(200) DEFAULT 0, ' +
      '`available_amount` varchar(200) DEFAULT 0,' +
      '`wallet` varchar(200) DEFAULT NULL, ' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.manager.insert('profit_wallet', profitWalletSeed)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `profit_wallet`');
  }

}
