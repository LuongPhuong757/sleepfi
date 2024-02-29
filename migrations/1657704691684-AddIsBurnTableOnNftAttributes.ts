import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsBurnTableOnNftAttributes1657704691684 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_attributes` ADD `is_burn` tinyint DEFAULT 0 AFTER `is_mint`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `is_burn`');
  }

}
