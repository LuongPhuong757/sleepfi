import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumeNameInNftAttributesTable1658744128571 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `nft_attributes` add name varchar(255) null AFTER nft_name');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `nft_attributes` DROP COLUMN name');
    }

}
