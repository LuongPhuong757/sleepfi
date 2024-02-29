import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRewardHistory1662345153984 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `reward_history` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT, ' +
            '`tvl` varchar(200) DEFAULT 0,' +
            '`reward_time` longtext NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `reward_history`');
    }

}
