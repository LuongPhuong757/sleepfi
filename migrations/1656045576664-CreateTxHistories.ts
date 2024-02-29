import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTxHistories1656045576664 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `tx_histories` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`user_id` int NOT NULL,' +
        '`symbol` varchar(200) NULL,' +
        '`token_address` varchar(500) NULL,' +
        '`amount` varchar(200) NULL, ' +
        '`token_id` varchar(500) NULL,' +
        '`contract_address` varchar(500) NULL,' +
        '`type` varchar(200) NOT NULL,' +
        '`tx` varchar(200) NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `tx_histories`');
  }
}
