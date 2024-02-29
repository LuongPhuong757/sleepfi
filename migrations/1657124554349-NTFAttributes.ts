import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNFTAttributes1657124554349 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE nft_attributes MODIFY COLUMN nft_id int NOT NULL COMMENT 'Ntf id refer table nfts';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE nft_attributes DROP COLUMN nft_id;');
  }

}
