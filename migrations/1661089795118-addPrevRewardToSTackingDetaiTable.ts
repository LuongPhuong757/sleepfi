import {MigrationInterface, QueryRunner} from "typeorm";

export class addPrevRewardToSTackingDetaiTable1661089795118 implements MigrationInterface {
    name = 'addPrevRewardToSTackingDetaiTable1661089795118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `stack_details` ADD `prev_reward` varchar(255) default 0 not null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `stack_details` DROP COLUMN `prev_reward`');
    }
}
