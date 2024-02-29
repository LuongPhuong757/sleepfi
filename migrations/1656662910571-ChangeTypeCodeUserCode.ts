import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeCodeUserCode1656662910571 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_code\` ADD \`code_used_at\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_code\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`user_code\` ADD \`code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_code\` DROP COLUMN \`expired\``);
        await queryRunner.query(`ALTER TABLE \`user_code\` ADD \`expired\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_code\` DROP COLUMN \`friend\``);
        await queryRunner.query(`ALTER TABLE \`user_code\` ADD \`friend\` varchar(255) NULL`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_code\` DROP COLUMN \`code_used_at\``);
        await queryRunner.query(`ALTER TABLE \`user_code\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`user_code\` ADD \`code\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_code\` DROP COLUMN \`friend\``);
        await queryRunner.query(`ALTER TABLE \`user_code\` ADD \`friend\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_code\` DROP COLUMN \`friend\``);
        await queryRunner.query(`ALTER TABLE \`user_code\` ADD \`friend\` varchar(255) NOT NULL`);
    }

}
