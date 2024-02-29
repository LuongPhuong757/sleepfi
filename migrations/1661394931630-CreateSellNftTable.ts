import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSellNftTable1661394931630 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `market_orders` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT, ' +
            '`user_id` int NULL,' +
            '`nft_id` int NULL,' +
            '`amount` varchar(255) NULL,' +
            '`fee` varchar(255) NULL,' +
            '`symbol` varchar(255) NULL,' +
            '`status` varchar(255) NULL,' +
            '`msg_error` varchar(255) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `market_orders`');
    }

}
