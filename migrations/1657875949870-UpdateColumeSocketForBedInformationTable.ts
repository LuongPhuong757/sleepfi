import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumeSocketForBedInformationTable1657875949870 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `bed_information` MODIFY COLUMN `socket` int default 0');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `bed_information` MODIFY COLUMN socket');
  }
}
