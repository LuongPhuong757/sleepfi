import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNftLevelUpTable1659017580609 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `nft_level_up` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`bed_id` int NULL,' +
      '`remain_time` varchar(200) NULL,' +
      '`level_up_time` varchar(200) NULL,' +
      '`status` varchar(200) NULL,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `user_whitelist`');
  }

}
