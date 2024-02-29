import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1597822219037 implements MigrationInterface {
  name = 'CreateUsers1597822219037';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `users` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`name` varchar(200) NULL,' +
        '`password` varchar(200) NULL, ' +
        '`email` varchar(200) NOT NULL,' +
        '`wallet` varchar(200) NULL,' +
        '`refer_code` int NULL,' +
        '`language` varchar(200) NULL,' +
        '`roles` varchar(200) NOT NULL,' +
        '`isAccountDisabled` tinyint NOT NULL,' +
        '`is_created_password` tinyint NOT NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' UNIQUE INDEX `email` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `email` ON `users`');
    await queryRunner.query('DROP TABLE `users`');
  }
}
