import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCollumNftTypeForNftAttributesTable1658220522882 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nft_attributes` ADD `nft_type` varchar(255) NOT NULL AFTER type');
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN `nft_type`');
      }
}
