import {MigrationInterface, QueryRunner} from "typeorm";

import {CATEGORY_ID, CATEGORY_NAME} from "../src/category/constants";
import {Category} from "../src/databases/entities/categories.entity";

export class SeederForNftCategory1656970260000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const categoryData = [
            {id: CATEGORY_ID[CATEGORY_NAME.BED], name: CATEGORY_NAME.BED},
            {id: CATEGORY_ID[CATEGORY_NAME.JEWEL], name: CATEGORY_NAME.JEWEL},
            {id: CATEGORY_ID[CATEGORY_NAME.ITEM], name: CATEGORY_NAME.ITEM},
        ]
        await queryRunner.manager.insert(Category, categoryData)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const categoryData = [
            {id: CATEGORY_ID[CATEGORY_NAME.BED], name: CATEGORY_NAME.BED},
            {id: CATEGORY_ID[CATEGORY_NAME.JEWEL], name: CATEGORY_NAME.JEWEL},
            {id: CATEGORY_ID[CATEGORY_NAME.ITEM], name: CATEGORY_NAME.ITEM},
        ]
        await queryRunner.manager.remove(categoryData)
    }

}
