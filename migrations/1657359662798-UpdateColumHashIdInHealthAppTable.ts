import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumHashIdInHealthAppTable1657359662798 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE health_app_data MODIFY COLUMN hash_id varchar(255) NULL`);
    await queryRunner.query(
      'ALTER TABLE `health_app_data` ADD `owner` varchar(255) NOT NULL AFTER `id`'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`health_app_data\` DROP COLUMN \`hash_id\``);
    await queryRunner.query(`ALTER TABLE \`health_app_data\` DROP COLUMN \`owner\``);
  }

}
