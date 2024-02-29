import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserCode1656043546552 implements MigrationInterface {
  name = 'CreateUserCode1656043546552';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `user_code` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`user_id` int NOT NULL,' +
        '`code` int NOT NULL, ' +
        '`expired` varchar(200) NOT NULL,' +
        '`friend` varchar(200) NOT NULL,' +
        '`is_used` tinyint NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `user_code`');
  }
}
