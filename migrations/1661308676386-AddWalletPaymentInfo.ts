import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWalletPaymentInfo1661308676386 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE payment_user_info ADD wallet varchar(200) NULL AFTER user_id`);
    await queryRunner.query(`ALTER TABLE payment_user_info ADD tx varchar(200) NULL AFTER wallet`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`payment_user_info\` DROP COLUMN \`wallet\``);
    await queryRunner.query(`ALTER TABLE \`payment_user_info\` DROP COLUMN \`tx\``);
  }

}
