import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsCompoundColumnInStackDetails1660275795972 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `stack_details` ADD `is_compound` tinyint default(0)');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `stack_details` DROP COLUMN `is_compound`');
    }

}
