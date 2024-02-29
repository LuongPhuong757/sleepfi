import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPayment1660546484123 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `payment_histories` ( `hash_id` varchar(200), `reservation` varchar(100), `email` varchar(200) NOT NULL, `order_id` varchar(100) NULL, `order_status` varchar(100) NULL, `transfer_id` varchar(100) NULL, `result_info` json DEFAULT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`hash_id`) ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;');
        await queryRunner.query('CREATE TABLE `payment_user_info` ( `hash_id` varchar(200), `reservation` varchar(100), `order_id` varchar(100) NULL, `email` varchar(200) NOT NULL, `user_id` int NULL, `amount` decimal (10.2) NOT NULL, `order_status` varchar(100) NOT NULL, `status` varchar(50) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`hash_id`) ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE payment_histories');
        await queryRunner.query('DROP TABLE payment_user_info');
    }

}
