import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMaxAmountInSpendingBalanceTable1658998796327 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `spending_balances` add max_amount varchar(255) null AFTER available_amount');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `spending_balances` DROP COLUMN max_amount');
    }

}
