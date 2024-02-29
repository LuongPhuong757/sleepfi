import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnLevelUpTimeOnNftAttribute1658373466486 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_attributes` ADD `level_up_time` varchar(255) NULL AFTER level');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `level_up_time`');
  }

}
