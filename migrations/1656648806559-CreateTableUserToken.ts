import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableUserToken1656648806559 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `user_token` ( ' +
              '`id` varchar(50) NOT NULL,' +
              '`token` varchar(900) NOT NULL,' +
              '`expired_in` int NOT NULL,' +
              '`user_id` int NOT NULL, ' +
              '`device_id` varchar(50) NULL,' +
              '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
              '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
              ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `user_token`');
    }
}
