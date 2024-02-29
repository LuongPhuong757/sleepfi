import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumTokenEarnSymbolInTrackingResultTable1657299981011 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        'ALTER TABLE `tracking_result` ADD `token_earn_symbol` varchar(255) NULL AFTER `actual_earn`'
      );
      await queryRunner.query(
        'ALTER TABLE `tracking_result` ADD `user_id` varchar(255) NOT NULL AFTER `tracking_id`'
      );
      await queryRunner.query(
        'ALTER TABLE `tracking_result` ADD `date_time` DATETIME NULL AFTER `token_earn_symbol`'
      );
      await queryRunner.query(
        'ALTER TABLE `tracking_result` ADD `day` varchar(255) NULL AFTER `date_time`'
      );
      await queryRunner.query(
        'ALTER TABLE `tracking_result` ADD `month` varchar(255) NULL AFTER `day`'
      );
      await queryRunner.query(
        'ALTER TABLE `tracking_result` ADD `year` varchar(255) NULL AFTER `month`'
      );
      await queryRunner.query('ALTER TABLE `tracking_result` MODIFY hash_id varchar(255) NULL');
     
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `tracking_result` DROP COLUMN `token_earn_symbol`');
      await queryRunner.query('ALTER TABLE `tracking_result` DROP COLUMN `user_id`');
      await queryRunner.query('ALTER TABLE `tracking_result` DROP COLUMN `day`');
      await queryRunner.query('ALTER TABLE `tracking_result` DROP COLUMN `month`');
      await queryRunner.query('ALTER TABLE `tracking_result` DROP COLUMN `year`');
      await queryRunner.query('ALTER TABLE `tracking_result` DROP COLUMN `hash_id`');
      await queryRunner.query('ALTER TABLE `tracking_result` DROP COLUMN `date_time`')
    }

}
