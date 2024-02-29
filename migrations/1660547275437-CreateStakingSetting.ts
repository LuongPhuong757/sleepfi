import { MigrationInterface, QueryRunner } from "typeorm";

import stackingSettingSeeds from "./seeds/stacking_setting"
export class CreateStakingScreen1660547275437 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `stacking_setting` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`earning_tokens` longtext NULL,' +
      '`minting_discount` longtext NULL,' +
      '`level_up_discount` longtext NULL,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );

    await queryRunner.manager.insert('stacking_setting', stackingSettingSeeds)

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `stacking_setting`');
  }

}
