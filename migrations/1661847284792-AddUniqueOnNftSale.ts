import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueOnNftSale1661847284792 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE nft_sales ADD UNIQUE(nft_id);');

        await queryRunner.query('ALTER TABLE nft_sales MODIFY symbol varchar(255) NOT NULL;');

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE nft_sales DROP INDEX nft_id;');

        await queryRunner.query('ALTER TABLE  MODIFY symbol varchar(255) NULL;');
    }

}
