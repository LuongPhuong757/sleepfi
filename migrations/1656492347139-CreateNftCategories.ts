import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateNftCategories1656492347139 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.createTable(
			new Table({
				name: 'nft_categories',
				columns: [
					{
						name: 'id',
						isPrimary: true,
						isUnique: true,
						type: 'int'
					},
					{
						name: 'name',
						type: 'varchar',
						length: '255',
					},
					{
						name: 'created_at',
						type: 'datetime',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'updated_at',
						type: 'datetime',
						default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
					},
				],
			}),
		);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `nft_categories`');
    }

}
