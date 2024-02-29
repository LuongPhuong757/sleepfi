import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTransactionTable1663145850915 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        'CREATE TABLE `user_transaction` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT, ' +
        '`type` varchar(200) DEFAULT NULL, ' +
        '`user_id` int NULL,' +
        '`nft_id` int NULL, ' +
        '`point_minted` int NULL, ' +
        '`point_add` int NULL, ' +
        '`minted_number` int NULL, ' +
        '`max_minting` int NULL, ' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
      );

      await queryRunner.query('ALTER TABLE bed_point ADD UNIQUE(bed_id);');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `user_transaction`');
      await queryRunner.query('ALTER TABLE bed_point DROP INDEX bed_id;');
    }

}
