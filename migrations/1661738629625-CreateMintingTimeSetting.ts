import {MigrationInterface, QueryRunner} from "typeorm";

import mintingTimeSettingSeed from "./seeds/minting_time_setting"

export class CreateMintingTimeSetting1661738629625 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `minting_time_setting` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT, ' +
            '`common` int NULL,' +
            '`uncommon` int NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
          );

          await queryRunner.manager.insert('minting_time_setting', mintingTimeSettingSeed)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `minting_time_setting`');
    }

}
