import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumItemTypeInNftAttributeTable1657529117374 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        'ALTER TABLE `nft_attributes` ADD `item_type`  varchar(200) AFTER `jewel_type`'
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `item_type`');
    }

}
