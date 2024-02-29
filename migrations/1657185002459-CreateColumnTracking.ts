import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateColumnTracking1657185002459 implements MigrationInterface {
    name = 'CreateColumnTracking1657185002459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tracking\` ADD \`resilience\` varchar(50) NULL`);
        await queryRunner.query(`alter table \`tracking\` modify \`items_level\` smallint null`)
        await queryRunner.query(`alter table \`tracking\` modify \`efficiency\` varchar(50) null`)
        await queryRunner.query(`alter table \`tracking\` modify \`luck\` varchar(50) null`)
        await queryRunner.query(`alter table \`tracking\` modify \`bonus\` varchar(50) null`)
        await queryRunner.query(`alter table \`tracking\` modify \`special\` varchar(50) null`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`resilience\``);

    }

}
