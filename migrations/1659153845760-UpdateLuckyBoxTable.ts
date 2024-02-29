import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateLuckyBoxTable1659153845760 implements MigrationInterface {
    name = 'UpdateLuckyBoxTable1659153845760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE lucky_box ADD image varchar(100) NULL;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE lucky_box DROP image varchar(100) NULL;`);
    }

}
