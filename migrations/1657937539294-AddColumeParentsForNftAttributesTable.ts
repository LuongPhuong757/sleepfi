import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumeParentsForNftAttributesTable1657937539294 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_attributes` ADD `parent_1` int null AFTER nft_name');
    await queryRunner.query('ALTER TABLE `nft_attributes` ADD `parent_2` int null AFTER parent_1');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `parent_1`');
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `parent_2`');
  }

}
