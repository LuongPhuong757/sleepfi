import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsValidUserTokenCode1658373466487 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user_token` ADD `is_valid` tinyint NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user_token` DROP COLUMN `is_valid`');
  }

}
