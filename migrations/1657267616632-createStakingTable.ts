import {MigrationInterface, QueryRunner} from "typeorm";

export class createStakingTable1657267616632 implements MigrationInterface {
    name = 'createStakingTable1657267616632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `staking` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT, ' +
            '`tvl` varchar(200) DEFAULT 0,' +
            '`symbol` varchar(200) DEFAULT 0,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `staking`');
    }

}
