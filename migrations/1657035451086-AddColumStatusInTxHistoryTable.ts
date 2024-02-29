import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumStatusInTxHistoryTable1657035451086 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        'ALTER TABLE `tx_histories` ADD `status` varchar(255) AFTER `tx`',
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        'ALTER TABLE `tx_histories` DROP COLUMN status',
      );
    }

}
