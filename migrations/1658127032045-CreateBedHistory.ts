import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBedHistory1658127032045 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `bed_history` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`bed_id` int NULL,' +
      '`efficiency` varchar(200) NOT NULL,' +
      '`luck` varchar(200) NOT NULL,' +
      '`bonus` varchar(200) NOT NULL,' +
      '`special` varchar(200) NOT NULL,' +
      '`resilience` varchar(200) NOT NULL,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `bed_history`');
  }

}
