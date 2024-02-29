import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusStackingColumnOnStackDetails1656667667957
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `stack_details` ADD `status_stacking` varchar(255) AFTER `status`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `stack_details` DROP COLUMN status_stacking',
    );
  }
}
