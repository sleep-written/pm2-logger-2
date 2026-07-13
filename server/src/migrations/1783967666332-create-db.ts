import type { MigrationInterface, QueryRunner } from 'typeorm';

import { Menu } from '@entities/menu';

export class CreateDb1783967666332 implements MigrationInterface {
    name = 'CreateDb1783967666332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `--sql
            CREATE TABLE "Menu" (
                "id"    integer     NOT NULL    PRIMARY KEY AUTOINCREMENT,
                "icon"  varchar     NOT NULL,
                "path"  varchar     NOT NULL,
                "text"  nvarchar    NOT NULL
            )`
        );

        const manage = new Menu();
        manage.icon = 'frame_bug';
        manage.path = '/manage';
        manage.text = 'Manage Process';
        await queryRunner.manager.save(manage);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.deleteAll(Menu);
        await queryRunner.query(`DROP TABLE "Menu"`);
    }

}
