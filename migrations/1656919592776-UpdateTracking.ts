import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTracking1656919592776 implements MigrationInterface {
    name = 'UpdateTracking1656919592776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`hash_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`bet_used\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`item_used\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`time_sleep\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`year\` smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`month\` smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`day\` smallint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`day\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`month\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`year\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`time_sleep\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`item_used\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`bet_used\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`hash_id\``);
    }

}
