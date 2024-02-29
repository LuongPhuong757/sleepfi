import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateWithdraw1656491952741 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        'CREATE TABLE `withdraws` ( ' +
          '`id` int NOT NULL AUTO_INCREMENT, ' +
          '`type` varchar(200) NOT NULL, ' +
          '`contract_address` varchar(500) NULL, ' +
          '`token_id` varchar(500) NULL, ' +
          '`token_address` varchar(200) NULL,' +
          '`amount` varchar(200) NULL, ' +
          '`user_id` int NULL,' +
          '`main_wallet` varchar(200) NOT NULL,' +
          '`status` varchar(200) NOT NULL,' +
          '`tx_hash` varchar(500) NULL,' +
          '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
          '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
          ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `withdraws`');
    }

}
