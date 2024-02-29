import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateActionHistories1658853209163 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `action_histories` ( ' +
            '`id` INT NOT NULL AUTO_INCREMENT, ' +
            '`type` varchar(200) NOT NULL,' +
            '`target_type` varchar(50) NULL,' +
            '`user_id` int NOT NULL,' +
            '`from_user_id` int NULL,' +
            '`target_id` int NULL COMMENT \'nft_id or luckybox id\',' +
            '`price` DECIMAL(10, 2) NULL,' +
            '`amount` int NULL,' +
            '`symbol` varchar(50) NULL,' +
            '`to_symbol` varchar(50) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `action_histories`');
    }
}
