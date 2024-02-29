import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterAmoutToStringOnStackTable1657684338067 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `stack_details` MODIFY COLUMN `amount` varchar(255) NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `stack_details` MODIFY COLUMN amount INT;');
    }

}
