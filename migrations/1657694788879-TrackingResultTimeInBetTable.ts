import {MigrationInterface, QueryRunner} from "typeorm";

export class TrackingResultTimeInBetTable1657694788879 implements MigrationInterface {
    name = 'TrackingResultTimeInBetTable1657694788879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE tracking_result ADD time_in_bed int NULL;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE \`tracking_result\` DROP COLUMN \`time_in_bed\`');
    }

}
