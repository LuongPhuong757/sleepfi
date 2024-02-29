import { MigrationInterface, QueryRunner } from "typeorm";

export class AnimationGachaConfigTable1661308676386 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('NORMAL_ANIMATION', '[{"value":"Rainbow","percent":0},{"value":"Gold","percent":0},{"value":"Normal","percent":100}]', CURRENT_TIMESTAMP(6));`);

    await queryRunner.query(`INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('GOLD_ANIMATION', '[{"value":"Rainbow","percent":0},{"value":"Gold","percent":60},{"value":"Normal","percent":40}]', CURRENT_TIMESTAMP(6));`);

    await queryRunner.query(`INSERT INTO gacha_prob_config (\`key\`, value, created_at) VALUES('RAINBOW_ANIMATION', '[{"value":"Rainbow","percent":50},{"value":"Gold","percent":40},{"value":"Normal","percent":10}]', CURRENT_TIMESTAMP(6));`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM gacha_prob_config  where \`key\` = 'NORMAL_ANIMATION';`);
    await queryRunner.query(`DELETE FROM gacha_prob_config  where \`key\` = 'GOLD_ANIMATION';`);
    await queryRunner.query(`DELETE FROM gacha_prob_config  where \`key\` = 'RAINBOW_ANIMATION';`);
  }

}
