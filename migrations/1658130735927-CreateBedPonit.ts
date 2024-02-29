import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBedPonit1658130735927 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `bed_point` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`bed_id` int NULL,' +
      '`user_id` int NULL,' +
      '`bed_point` int NULL,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `bed_point`');
  }

}
