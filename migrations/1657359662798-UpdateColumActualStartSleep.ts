import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumActualStartSleep1657359662798 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE tracking_result ADD start_sleep_time INT NOT NULL COMMENT 'actual start sleep time of user';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tracking_result\` DROP COLUMN \`start_sleep_time\``);
  }

}
