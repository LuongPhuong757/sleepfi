import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNfts1656044060184 implements MigrationInterface {
  name = 'CreateNfts1656044060184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `nfts` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`category_id` int NOT NULL,' +
        '`is_lock` tinyint NOT NULL, ' +
        '`status` varchar(200) NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `nfts`');
  }
}
