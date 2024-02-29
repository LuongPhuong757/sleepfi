import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnDurability1657102720000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE \`tracking\` DROP COLUMN \`bet_used\``);
        await queryRunner.query(`ALTER TABLE \`nft_attributes\` ADD \`durability\` int NOT NULL DEFAULT 100`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nft_attributes\` ADD \`durability\` int NOT NULL DEFAULT 100`);
    }
}
