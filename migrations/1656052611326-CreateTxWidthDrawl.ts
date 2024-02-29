import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTxWidthDrawl1656052611326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `tx_widthdrawl` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`user_id` int NOT NULL,' +
        '`amount` varchar(200) NOT NULL,' +
        '`from_address` varchar(200) NOT NULL, ' +
        '`tx` varchar(200) NOT NULL, ' +
        '`status` varchar(200) NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `tx_widthdrawl`');
  }
}
