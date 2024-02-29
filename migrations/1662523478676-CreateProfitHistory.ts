import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfitHistory1662523478676 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `profit_history` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`type` varchar(200) DEFAULT NULL, ' +
      '`symbol` varchar(200) DEFAULT NULL,' +
      '`amount` varchar(200) DEFAULT 0, ' +
      '`user_id` int NOT NULL, ' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `profit_history`');
  }

}
