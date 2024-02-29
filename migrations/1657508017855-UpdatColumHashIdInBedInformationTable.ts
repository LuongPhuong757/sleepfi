import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatColumHashIdInBedInformationTable1657508017855 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE bed_information MODIFY COLUMN hash_id varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`bed_information\` DROP COLUMN \`hash_id\``);
  }

}
