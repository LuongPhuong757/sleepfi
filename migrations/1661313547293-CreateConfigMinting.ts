import { MigrationInterface, QueryRunner } from "typeorm";

import configMintingSeed from "./seeds/config_minting"
export class CreateConfigMinting1661313547293 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `config_minting` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`level` int NULL,' +
      '`minting_number` int NULL,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );

    await queryRunner.manager.insert('config_minting', configMintingSeed)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `config_minting`');
  }

}
