import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumeInStakeTable1659584378619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `staking` ADD `current_percent_reward` varchar(255) default 0 not null');
        await queryRunner.query('ALTER TABLE `staking` ADD `next_percent_reward` varchar(255) default 0 not null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `staking` DROP COLUMN `current_percent_reward`');
        await queryRunner.query('ALTER TABLE `staking` DROP COLUMN `next_percent_reward`');
    }

}
