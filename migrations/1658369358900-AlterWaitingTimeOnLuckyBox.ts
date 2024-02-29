import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterWaitingTimeOnLuckyBox1658369358900 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `lucky_box` MODIFY COLUMN `waiting_time` varchar(255) NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `lucky_box` MODIFY COLUMN waiting_time INT;');
  }

}
