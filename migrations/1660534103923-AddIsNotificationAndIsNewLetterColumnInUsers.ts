import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsNotificationAndIsNewLetterColumnInUsers1660534103923 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `users` ADD `isNotification` tinyint default 0');
        await queryRunner.query('ALTER TABLE `users` ADD `isNewLetter` tinyint default 0');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `users` DROP COLUMN `isNotification`');
        await queryRunner.query('ALTER TABLE `users` DROP COLUMN `isNewLetter`');
    }

}
