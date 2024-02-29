import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateHealthAppData1657073808002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `user_earn_transactions` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`hash_id` varchar(255) NOT NULL,' +
            '`user_id` int NOT NULL,' +
            '`tracking_id` int NOT NULL,' +
            '`tracking_result_id` int NOT NULL,' +
            '`amount` varchar(255) NULL,' +
            '`symbol` varchar(50) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `user_earn_transactions`');
    }
}
