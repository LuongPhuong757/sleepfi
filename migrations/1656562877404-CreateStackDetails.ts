import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStackDetails1656562877404 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `stack_details` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`user_id` int NOT NULL, ' +
      '`stack_campaign_id` int NOT NULL, ' +
      '`stake_token` varchar(500) NULL, ' +
      '`amount` varchar(200) NOT NULL, ' +
      '`is_lock` tinyint default false NOT NULL,' +
      '`reward` varchar(200) NOT NULL, ' +
      '`start_time` varchar(200) NOT NULL,' +
      '`reward_time` varchar(200) NOT NULL,' +
      '`lock_time` varchar(200) NOT NULL,' +
      '`status` tinyint default false NOT NULL,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `stack_details`');
  }

}
