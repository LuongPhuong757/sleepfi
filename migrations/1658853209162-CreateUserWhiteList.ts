import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserWhiteList1658853209162 implements MigrationInterface {
    name = 'CreateUserWhiteList1658853209162';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `user_whitelist` ( ' +
                '`id` int NOT NULL AUTO_INCREMENT, ' +
                '`email` varchar(200) NOT NULL,' +
                '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
                '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
                ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `user_whitelist`');
    }
}
