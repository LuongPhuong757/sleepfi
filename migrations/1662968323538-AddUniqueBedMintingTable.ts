import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueBedMintingTable1662968323538 implements MigrationInterface {


  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE bed_minting ADD UNIQUE(bed_id);');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE bed_minting DROP INDEX bed_id;');
  }
}
