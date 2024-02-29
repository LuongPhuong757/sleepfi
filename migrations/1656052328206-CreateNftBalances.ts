import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNftBalances1656052328206 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `nft_balances` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`user_id` int NOT NULL,' +
        '`token_id` int NOT NULL,' +
        '`address` varchar(200) NOT NULL, ' +
        '`status` varchar(200) NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `nft_balances`');
  }
}
