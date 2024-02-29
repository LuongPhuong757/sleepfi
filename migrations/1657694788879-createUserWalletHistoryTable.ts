import {MigrationInterface, QueryRunner} from "typeorm";

export class createUserWalletHistoryTable1657694788879 implements MigrationInterface {
    name = 'createUserWalletHistoryTable1657694788879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `user_wallet_histories` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT, ' +
            '`user_id` int NULL,' +
            '`old_wallet` varchar(200) NOT NULL,' +
            '`new_wallet` varchar(200) NOT NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `user_wallet_histories`');
    }

}
