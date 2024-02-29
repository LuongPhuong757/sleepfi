// import { MigrationInterface, QueryRunner } from 'typeorm';
//
// export class AddGachaModuleTable1657955584332 implements MigrationInterface {
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(
//             'CREATE TABLE `gacha_prob_config` ( `id` int NOT NULL AUTO_INCREMENT, `key` varchar(50) DEFAULT NULL, `value` JSON DEFAULT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;',
//         );
//         await queryRunner.query(
//             'CREATE TABLE `user_gacha_info` ( `id` int NOT NULL AUTO_INCREMENT, `user_id` int, `common_times` int DEFAULT 0 NULL, `special_times` int DEFAULT 0 NULL, `t_special_times` int DEFAULT 0 NULL, `t_common_times` int DEFAULT 0 NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;',
//         );
//         await queryRunner.query(
//             'CREATE TABLE `user_gacha_result` ( `id` int NOT NULL AUTO_INCREMENT, `user_id` int,`tx_id` varchar(100) DEFAULT NULL, gacha_type varchar(50) NULL,`result` JSON, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;',
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('COMMON', '{ "Bed": { "Common": 0.25, "Uncommon": 0.25, "Epic_Bed": 0, "Legendaly_Bed": 0 }, "Jewels": { "level_1": 2, "level_2": 1, "level_3": 0, "level_4": 0 }, "Items": { "level_1": 5, "level_2": 2.5, "level_3": 0, "level_4": 0 }, "slft": { "percent": 89 } }', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('SPECIAL', '{ "Bed": { "Common": 0.5, "Uncommon": 0.5, "Epic_Bed": 0, "Legendaly_Bed": 0 }, "Jewels": { "level_1": 4, "level_2": 3, "level_3": 2, "level_4": 1 }, "Items": { "level_1": 6, "level_2": 3.0, "level_3": 1.5, "level_4": 0.8 }, "slft": { "percent": 77.7 } }', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('COMMON_RESET_TIME', '{ "times": 100 }', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('SPECIAL_RESET_TIME', '{ "times": 100 }', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('COST_OPEN_GACHA', '{ "NORMAL_GACHA_SINGLE": 24, "NORMAL_GACHA_MULTIPLE": 200, "SPECIAL_GACHA_SINGLE": 240, "SPECIAL_GACHA_MULTIPLE": 2000 }', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('NORMAL_GACHA_MAIN_NET', '[{"value":"COMMON_BED","percent":0.25,"amount":1,"type":"bed","quality":"common","category":1,"level":0},{"value":"UNCOMMON_BED","percent":0.25,"amount":1,"type":"bed","quality":"uncomond","category":1,"level":0},{"value":"JEWEL_LV1","percent":1,"amount":1,"type":"jewel","quality":"common","category":2,"level":1},{"value":"JEWEL_LV2","percent":1,"amount":1,"type":"jewel","quality":"common","category":2,"level":2},{"value":"ITEM_LV1","percent":5,"amount":1,"type":"item","quality":"common","category":3,"level":1},{"value":"ITEM_LV2","percent":2.5,"amount":1,"type":"item","quality":"common","category":3,"level":2},{"value":"SLFT","percent":90,"amount":11,"type":"SLFT"}]', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('SPECIAL_GACHA_MAIN_NET', '[{"value":"COMMON_BED","percent":0.5,"amount":1,"type":"bed","quality":"common","category":1,"level":0},{"value":"UNCOMMON_BED","percent":0.5,"amount":1,"type":"bed","quality":"uncomond","category":1,"level":0},{"value":"JEWEL_LV1","percent":4,"amount":1,"type":"jewel","quality":"common","category":2,"level":1},{"value":"JEWEL_LV2","percent":3,"amount":1,"type":"jewel","quality":"common","category":2,"level":2},{"value":"JEWEL_LV3","percent":2,"amount":1,"type":"jewel","quality":"common","category":2,"level":3},{"value":"JEWEL_LV4","percent":1,"amount":1,"type":"jewel","quality":"common","category":2,"level":4},{"value":"ITEM_LV1","percent":6,"amount":1,"type":"item","quality":"common","category":3,"level":1},{"value":"ITEM_LV2","percent":3,"amount":1,"type":"item","quality":"common","category":3,"level":2},{"value":"ITEM_LV3","percent":1.5,"amount":1,"type":"item","quality":"common","category":3,"level":3},{"value":"ITEM_LV4","percent":0.8,"amount":1,"type":"item","quality":"common","category":3,"level":4},{"value":"SLFT","percent":77.7,"amount":100,"type":"SLFT"}]', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('NORMAL_GACHA_TEST_NET', '[{"value":"COMMON_BED","percent":0.25,"amount":1,"type":"bed","quality":"common","category":1,"level":0},{"value":"UNCOMMON_BED","percent":0.25,"amount":1,"type":"bed","quality":"uncomond","category":1,"level":0},{"value":"JEWEL_LV1","percent":1,"amount":1,"type":"jewel","quality":"common","category":2,"level":1},{"value":"JEWEL_LV2","percent":1,"amount":1,"type":"jewel","quality":"common","category":2,"level":2},{"value":"ITEM_LV1","percent":5,"amount":1,"type":"item","quality":"common","category":3,"level":1},{"value":"ITEM_LV2","percent":2.5,"amount":1,"type":"item","quality":"common","category":3,"level":2},{"value":"SLFT","percent":90,"amount":11,"type":"SLFT"}]', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('SPECIAL_GACHA_MAIN_NET', '[{"value":"short","percent":32},{"value":"middle","percent":32},{"value":"long","percent":32},{"value":"flexible","percent":4}]', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('COMMON_BED_NORMAL_MAIN_NET', '[{"value":"short","percent":32},{"value":"middle","percent":32},{"value":"long","percent":32},{"value":"flexible","percent":4}]', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('UNCOMMON_BED_NORMAL_MAIN_NET', '[{"value":"short","percent":33},{"value":"middle","percent":33},{"value":"long","percent":33},{"value":"flexible","percent":1}]', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('COMMON_BED_CLASS_NFT', '[{"value":"short","percent":25},{"value":"middle","percent":25},{"value":"long","percent":25},{"value":"flexible","percent":25}]', CURRENT_TIMESTAMP(6));`,
//         );
//
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('PRO_NORMAL_TEST_NET', '{"Bed": [{"name": "Common Bed", "value": 0.5}, {"name": "Uncommon Bed", "value": 0}, {"name": "Rare Bed", "value": 0}, {"name": "Epic Bed", "value": 0}, {"name": "Legendary Bed", "value": 0}], "Items": [{"name": "Level 1", "value": 5}, {"name": "Level 2", "value": 2.5}, {"name": "Level 3", "value": 0}, {"name": "Level 4", "value": 0}], "Token": [{"name": "slft", "value": 89}], "Jewels": [{"name": "Level 1", "value": 2}, {"name": "Level 2", "value": 1}, {"name": "Level 3", "value": 0}, {"name": "Level 4", "value": 0}]}', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('PRO_SPECIAL_TEST_NET', '{"Bed": [{"name": "Common Bed", "value": 0.5}, {"name": "Uncommon Bed", "value": 0.5}, {"name": "Rare Bed", "value": 0}, {"name": "Epic Bed", "value": 0}, {"name": "Legendery Bed", "value": 0}], "Items": [{"name": "Level 1", "value": 6}, {"name": "Level 2", "value": 3}, {"name": "Level 3", "value": 1.5}, {"name": "Level 4", "value": 0.8}], "Token": [{"name": "slft", "value": 77.7}], "Jewels": [{"name": "Level 1", "value": 4}, {"name": "Level 2", "value": 3}, {"name": "Level 3", "value": 2}, {"name": "Level 4", "value": 1}]}', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('PRO_NORMAL_MAIN_NET', '{"Bed": [{"name": "Common Bed", "value": 0.25}, {"name": "Uncommon Bed", "value": 0.25}, {"name": "Rare Bed", "value": 0}, {"name": "Epic Bed", "value": 0}, {"name": "Legendary Bed", "value": 0}], "Items": [{"name": "Level 1", "value": 2}, {"name": "Level 2", "value": 1}, {"name": "Level 3", "value": 0}, {"name": "Level 4", "value": 0}], "Token": [{"name": "slft", "value": 89}], "Jewels": [{"name": "Level 1", "value": 5}, {"name": "Level 2", "value": 2.5}, {"name": "Level 3", "value": 0}, {"name": "Level 4", "value": 0}]}', CURRENT_TIMESTAMP(6));`,
//         );
//         await queryRunner.query(
//             `INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('PRO_SPECIAL_MAIN_NET', '{"Bed": [{"name": "Common Bed", "value": 0.5}, {"name": "Uncommon Bed", "value": 0.5}, {"name": "Rare Bed", "value": 0}, {"name": "Epic Bed", "value": 0}, {"name": "Legendary Bed", "value": 0}], "Items": [{"name": "Level 1", "value": 4}, {"name": "Level 2", "value": 3}, {"name": "Level 3", "value": 2}, {"name": "Level 4", "value": 1}], "Token": [{"name": "slft", "value": 77.7}], "Jewels": [{"name": "Level 1", "value": 6}, {"name": "Level 2", "value": 3}, {"name": "Level 3", "value": 1.5}, {"name": "Level 4", "value": 0.8}]}', CURRENT_TIMESTAMP(6));`,
//         );
//     }
//
//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query('Drop table gacha_prob_config;');
//         await queryRunner.query('Drop table user_gacha_result;');
//         await queryRunner.query('Drop table user_gacha_info;');
//     }
// }
