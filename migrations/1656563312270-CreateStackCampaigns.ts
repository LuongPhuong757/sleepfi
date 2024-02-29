import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStackCampaigns1656563312270 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `stack_campaigns` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`stake_token` varchar(500) NULL, ' +
      '`reward_token` varchar(500) NULL, ' +
      '`penalty_rate` varchar(500) NULL, ' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `stack_campaigns`');
  }

}
