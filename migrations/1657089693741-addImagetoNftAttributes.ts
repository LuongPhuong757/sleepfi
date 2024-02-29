import {MigrationInterface, QueryRunner} from "typeorm";

export class addImagetoNftAttributes1657089693741 implements MigrationInterface {
    name = 'addImagetoNftAttributes1657089693741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `nft_attributes` ADD `image` varchar(255) NOT NULL AFTER `nft_id`'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `image`');
    }

}
