import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLuckyBox1657355027593 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `lucky_box` ( ' +
      '`id` int NOT NULL AUTO_INCREMENT, ' +
      '`user_id` int NOT NULL,' +
      '`level` int NOT NULL,' +
      '`waiting_time` int NOT NULL,' +
      '`speed_up_cost` varchar(200) NOT NULL,' +
      '`redraw_rate` varchar(200) NOT NULL, ' +
      '`opening_cost` varchar(200) NOT NULL, ' +
      '`type_gift` varchar(200) NOT NULL,' +
      '`symbol` varchar(200),' +
      '`amount` varchar(200),' +
      '`nft_id` int,' +
      '`is_open` tinyint DEFAULT 0,' +
      '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
      ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `lucky_box`');
  }

}
