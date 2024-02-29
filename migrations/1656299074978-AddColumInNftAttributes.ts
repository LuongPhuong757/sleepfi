import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumInNftAttributes1656299074978 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `nft_attributes` ADD `contract_address` varchar(255) NOT NULL AFTER `nft_id`'
    )
    await queryRunner.query(
      'ALTER TABLE `nft_attributes` ADD `token_id` int NOT NULL AFTER `contract_address`'
    )
    await queryRunner.query(
      'ALTER TABLE `nft_attributes` ADD `owner` varchar(255) NOT NULL AFTER `token_id`'
    )
    await queryRunner.query(
      'ALTER TABLE `nft_attributes` ADD `type` varchar(255) NOT NULL AFTER `token_id`'
    )
    await queryRunner.query(
      'ALTER TABLE `nft_attributes` ADD `class` varchar(255) NOT NULL AFTER `type`'
    )
    await queryRunner.query(
      'ALTER TABLE `nft_attributes` ADD `quality` varchar(255) NOT NULL AFTER `class`'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `contract_address`')
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `token_id`')
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `owner`')
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `type`')
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `class`')
    await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `quality`')
  }
}
