import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumeMaxAmountInSpendingBalanceTable1659078963499 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `spending_balances` MODIFY COLUMN `max_amount` varchar(255) DEFAULT 0');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `spending_balances` DROP COLUMN max_amount');
  }

}
