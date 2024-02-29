import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumSocketInBedInformationTable1657597087034 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE bed_information ADD socket int NULL AFTER bed_id`);
      await queryRunner.query(`ALTER TABLE bed_information ADD enable_jewel tinyint NOT NULL AFTER item_id`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE \`bed_information\` DROP COLUMN \`socket\``);
      await queryRunner.query(`ALTER TABLE \`bed_information\` DROP COLUMN \`enable_jewel\``);
    }

}
