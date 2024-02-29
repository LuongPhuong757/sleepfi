import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTracking1656052981513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `tracking` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`user_id` int NOT NULL,' +
        '`bed_type` varchar(200) NOT NULL,' +
        '`insurance` varchar(200) NOT NULL,' +
        '`alrm` tinyint NOT NULL,' +
        '`start_sleep` int NOT NULL,' +
        '`wake_up` int NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `tracking`');
  }
}
