import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBedInformationTable1661308676386 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE bed_information ADD socket_slot_1 int NULL AFTER socket`);
    await queryRunner.query(`ALTER TABLE bed_information ADD socket_slot_2 int NULL AFTER socket_slot_1`);
    await queryRunner.query(`ALTER TABLE bed_information ADD socket_slot_3 int NULL AFTER socket_slot_2`);
    await queryRunner.query(`ALTER TABLE bed_information ADD socket_slot_4 int NULL AFTER socket_slot_3`);
    await queryRunner.query(`ALTER TABLE bed_information ADD socket_slot_5 int NULL AFTER socket_slot_4`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`bed_information\` DROP COLUMN \`socket_slot_1\``);
    await queryRunner.query(`ALTER TABLE \`bed_information\` DROP COLUMN \`socket_slot_2\``);
    await queryRunner.query(`ALTER TABLE \`bed_information\` DROP COLUMN \`socket_slot_3\``);
    await queryRunner.query(`ALTER TABLE \`bed_information\` DROP COLUMN \`socket_slot_4\``);
    await queryRunner.query(`ALTER TABLE \`bed_information\` DROP COLUMN \`socket_slot_5\``);
  }

}
