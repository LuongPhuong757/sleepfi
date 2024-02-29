import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlocks1656052830473 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `blocks` ( ' +
        '`block_id` varchar(200) NOT NULL, ' +
        '`contract` varchar(200) NOT NULL,' +
        '`from_block` int NOT NULL,' +
        '`block` int NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`block_id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `blocks`');
  }
}
