import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsMintToNftAttributeTable1657167245110 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `nft_attributes` ADD `is_mint` int DEFAULT 0 AFTER `type`'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `is_mint`');
  }

}
