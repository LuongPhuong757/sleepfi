import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateHealthAppData1657073808001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `health_app_data` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`hash_id` varchar(255) NOT NULL,' +
            '`tracking_id` int NOT NULL,' +
            '`data_type` varchar(255) NULL,' +
            '`value` varchar(255) NULL,' +
            '`platform_type` varchar(255) NULL,' +
            '`unit` varchar(255)  NULL,' +
            '`date_from` datetime(6)  NULL,' +
            '`date_to` datetime(6)  NULL,' +
            '`source_name` varchar(255) NULL,' +
            '`source_id` varchar(255) NULL,' +
            '`year` smallint NULL,' +
            '`month` smallint NULL,' +
            '`day` smallint NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `health_app_data`');
    }
}
