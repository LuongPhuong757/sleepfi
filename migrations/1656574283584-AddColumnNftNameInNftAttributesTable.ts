import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnNftNameInNftAttributesTable1656574283584 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `nft_attributes` ADD `nft_name` varchar(255) NOT NULL AFTER `nft_id`'
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `nft_name`');
    }

}
