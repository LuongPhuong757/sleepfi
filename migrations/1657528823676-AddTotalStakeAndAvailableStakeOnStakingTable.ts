import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTotalStakeAndAvailableStakeOnStakingTable1657528823676 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `staking` ADD `total_stake_allocation` varchar(200) AFTER `tvl`, ADD `available_total_stake` varchar(255) DEFAULT NULL AFTER `tvl`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `total_stake_allocation` DROP COLUMN `jewel_type`');
  }

}
