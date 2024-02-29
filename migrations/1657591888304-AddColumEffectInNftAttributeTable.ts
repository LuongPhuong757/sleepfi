import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumEffectInNftAttributeTable1657591888304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        'ALTER TABLE `nft_attributes` ADD `effect`  varchar(200) AFTER `item_type`'
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `effect`');
    }

}
