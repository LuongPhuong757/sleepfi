import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserOtp1656559056443 implements MigrationInterface {
    name = 'CreateUserOtp1656559056443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `user_otp_code` ( ' +
            '`id` int NOT NULL AUTO_INCREMENT, ' +
            '`code` int NOT NULL,' +
            '`expired_at` int COMMENT \'created_at + 60s\',' +
            '`email` varchar(200) NOT NULL, ' +
            '`status` varchar(200) NOT NULL, ' +
            '`type` varchar(200) COMMENT \'SIGN_UP,ADD_WALLET,CHANGE_PASS, IMPORT_WALLET\',' +
            '`created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),' +
            ' PRIMARY KEY (`id`)) ENGINE=InnoDB',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `user_otp_code`');
    }

}
