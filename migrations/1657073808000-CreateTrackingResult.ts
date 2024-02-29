import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTrackingResult1657073808000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `tracking_result` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`hash_id` varchar(255) NOT NULL,' +
            '`tracking_id` int NOT NULL,' +
            '`bed_time` varchar(50),' +
            '`sleep_onset_time` varchar(50) NULL,' +
            '`woke_up_time` varchar(50) NULL,' +
            '`n_awk` smallint NULL,' +
            '`sleep_duration_time` varchar(50) NULL,' +
            '`sleep_quality` smallint NULL,' +
            '`actual_earn` varchar(255) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `tracking_result`');
    }
}
