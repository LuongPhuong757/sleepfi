import {MigrationInterface, QueryRunner} from "typeorm";

export class AddStatusInStaking1658458627810 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `staking` add status varchar(255) null');
        await queryRunner.query('ALTER TABLE `staking` add end_time_campaign varchar(255) null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `staking` DROP COLUMN status');
        await queryRunner.query('ALTER TABLE `staking` DROP COLUMN end_time_campaign');
    }

}
