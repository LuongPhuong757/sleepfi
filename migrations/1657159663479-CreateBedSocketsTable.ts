import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateBedSocketsTable1657159663479 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        'CREATE TABLE `bed_information` ( ' +
        '`id` int NOT NULL AUTO_INCREMENT,' +
        '`hash_id` int NULL,' +
        '`enable` tinyint NOT NULL,' +
        '`bed_id` int NOT NULL,' +
        '`item_id` int NULL,' +
        '`jewel_slot_1` int NULL,' +
        '`jewel_slot_2` int NULL,' +
        '`jewel_slot_3` int NULL,' +
        '`jewel_slot_4` int NULL,' +
        '`jewel_slot_5` int NULL,' +
        '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
        ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `bed_information`');
    }

}
