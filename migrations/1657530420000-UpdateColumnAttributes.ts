import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateColumnNftAttributes1657530420000 implements MigrationInterface {
    name = 'UpdateColumnNftAttributes1657530420000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`alter table \`nft_attributes\` modify \`efficiency\` decimal(8,2) DEFAULT 0.00 null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`luck\` decimal(8,2) DEFAULT 0.00 null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`bonus\` decimal(8,2) DEFAULT 0.00 null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`special\` decimal(8,2) DEFAULT 0.00 null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`resilience\` decimal(8,2) DEFAULT 0.00 null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`durability\` decimal(8,2) DEFAULT 100.00 null`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`alter table \`nft_attributes\` modify \`efficiency\` smallint null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`luck\` smallint null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`bonus\` smallint null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`special\` smallint null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`durability\` smallint null`)
        await queryRunner.query(`alter table \`nft_attributes\` modify \`resilience\` smallint null`)
    }

}
