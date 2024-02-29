import {MigrationInterface, QueryRunner} from "typeorm";

import bonusSeed from "./seeds/m_bonus";
import effSeeds from "./seeds/m_eff";
import resiSeeds from "./seeds/m_resilience";

export class CreateMasterDataTable1657124554349 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `m_eff` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`level` int NOT NULL,' +
            '`earn` varchar(255) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
        queryRunner.manager.insert('m_eff', effSeeds)

        await queryRunner.query(
            'CREATE TABLE `m_bonus` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`stat` int NOT NULL,' +
            '`percent_increase` varchar(255) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
        queryRunner.manager.insert('m_bonus', bonusSeed)

        await queryRunner.query(
            'CREATE TABLE `m_luck` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`min` int NOT NULL,' +
            '`max` varchar(255) NULL,' +
            '`appear` varchar(255) NULL,' +
            '`luck_box_lv1` varchar(255) NULL,' +
            '`luck_box_lv2` varchar(255) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );


        await queryRunner.query(
            'CREATE TABLE `m_special` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`stat` int NOT NULL,' +
            '`earn` varchar(255) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );

        await queryRunner.query(
            'CREATE TABLE `m_resilience` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`stat` int NOT NULL,' +
            '`durability` varchar(255) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );

        queryRunner.manager.insert('m_resilience', resiSeeds)

        await queryRunner.query(
            'CREATE TABLE `m_level_repair` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`stat` int NOT NULL,' +
            '`repair_cost_cm` varchar(255) NULL,' +
            '`repair_cost_un_cm` varchar(255) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );

        await queryRunner.query(
            'CREATE TABLE `m_bed_definition` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT,' +
            '`level` int NOT NULL,' +
            '`leve_up_time` varchar(255) NULL,' +
            '`level_up_token` varchar(255) NULL,' +
            '`level_up_skip_free` varchar(255) NULL,' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            '`updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `m_eff`');
        await queryRunner.query('DROP TABLE `m_bonus`');
        await queryRunner.query('DROP TABLE `m_luck`');
        await queryRunner.query('DROP TABLE `m_special`');
        await queryRunner.query('DROP TABLE `m_resilience`');
        await queryRunner.query('DROP TABLE `m_level_repair`');
        await queryRunner.query('DROP TABLE `m_bed_definition`');
    }

}
