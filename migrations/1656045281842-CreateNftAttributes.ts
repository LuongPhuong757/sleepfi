import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNftAttributes1656045281842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `nft_attributes` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`nft_id` int NOT NULL,' +
        '`time` int NOT NULL,' +
        '`level` int NOT NULL,' +
        '`bed_mint` int NOT NULL,' +
        '`efficiency` int NOT NULL,' +
        '`luck` int NOT NULL,' +
        '`bonus` int NOT NULL,' +
        '`special` int NOT NULL,' +
        '`resilience` int NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `nft_attributes`');
  }
}
