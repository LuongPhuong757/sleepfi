import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTotalRewardOnUserStake1657333882730 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_stake` ADD `total_reward`  varchar(200) DEFAULT 0 AFTER `total_stake`'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user_stake` DROP COLUMN `total_reward`');
  }

}
