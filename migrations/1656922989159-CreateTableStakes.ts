import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableStakes1656922989159 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `user_stake` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`total_stake` varchar(200) DEFAULT 0,' +
      '`earning_token` varchar(200) DEFAULT 0, ' +
      '`minting_discount` varchar(200) DEFAULT 0,' +
      '`level_up_discount` varchar(200) DEFAULT 0,' +
      '`symbol` varchar(200) DEFAULT NULL,' +
      '`user_id` int NOT NULL,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `user_stake`');
  }

}
