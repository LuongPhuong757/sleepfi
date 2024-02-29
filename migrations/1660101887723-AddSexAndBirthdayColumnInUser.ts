import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSexAndBirthdayColumnInUser1660101887723 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `users` ADD `sex` varchar(255) null');
        await queryRunner.query('ALTER TABLE `users` ADD `birthday` int null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `users` DROP COLUMN `sex`');
        await queryRunner.query('ALTER TABLE `users` DROP COLUMN `birthday`');
    }

}
