import {MigrationInterface, QueryRunner} from "typeorm";

import {Settings} from "../src/databases/entities/settings.entity";
import {KEY_SETTING} from "../src/settings/constants/key_setting";

export class CreateSettings1656584418000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `settings` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT, ' +
            '`key` varchar(50) NULL, ' +
            '`value` varchar(50) NULL, ' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
        await queryRunner.manager.insert(Settings, [{
            key: KEY_SETTING.ENABLE_ACTIVE_CODE,
            value: "1",
        }, {
            key: KEY_SETTING.SLEEP_TRACKING_MAX_EARN_PER_DAY,
            value: "800",
        }])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `settings`');
    }

}
