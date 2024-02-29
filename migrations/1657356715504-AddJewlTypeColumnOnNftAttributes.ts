import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJewlTypeColumnOnNftAttributes1657356715504 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `nft_attributes` ADD `jewel_type`  varchar(200) AFTER `type`'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `jewel_type`');
  }

}
