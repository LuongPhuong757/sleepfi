import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveUserIdInBedPoinsTable1663125349353 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `bed_point` DROP COLUMN `user_id`');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `bed_point` DROP COLUMN `user_id`');
    }

}
