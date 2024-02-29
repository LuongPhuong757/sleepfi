import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTracking1657073435000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`bet_used\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`bed_used\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`efficiency\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`luck\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`bonus\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`special\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`bed_level\` smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`items_level\` smallint NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`enable_insurance\` smallint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`est_earn\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`actual_earn\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`time_range\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`status\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`quality\` smallint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`bet_used\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`efficiency\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`luck\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`bonus\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`special\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`bed_level\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`items_level\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`enable_insurance\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`est_earn\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`actual_earn\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`time_range\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`quality\``);
    }
}
