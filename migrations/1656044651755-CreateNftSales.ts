import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNftSales1656044651755 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `nft_sales` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`nft_id` int NOT NULL,' +
        '`price` varchar(200) NOT NULL, ' +
        '`status` varchar(200) NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `nft_sales`');
  }
}
