import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInsuranceColumnInTxHistories1660017538926 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tx_histories` ADD `insurance` varchar(255) null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `tx_histories` DROP COLUMN `insurance`');
    }

}
