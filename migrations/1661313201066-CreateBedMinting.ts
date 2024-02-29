import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBedMinting1661313201066 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `bed_minting` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`bed_id` int NULL,' +
      '`waiting_time` longtext NULL,' +
      '`minted_number` int NULL,' +
      '`max_minting` int NULL,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `bed_minting`');
  }

}
