import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumeEnableForBedInformationTable1657861053504 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `bed_information` MODIFY COLUMN `enable` varchar(255) NULL');
    await queryRunner.query('ALTER TABLE `bed_information` MODIFY COLUMN `enable_jewel` varchar(255) NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `bed_information` MODIFY COLUMN enable');
    await queryRunner.query('ALTER TABLE `bed_information` MODIFY COLUMN enable_jewel');
  }

}
