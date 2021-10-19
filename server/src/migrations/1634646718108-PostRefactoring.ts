import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1634646718108 implements MigrationInterface {
    name = 'PostRefactoring1634646718108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "displayName" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "picture" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "flag" character varying, "userID" uuid NOT NULL, "roomID" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "owner" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "joined" ("roomID" uuid NOT NULL, "userID" uuid NOT NULL, CONSTRAINT "PK_b0a4633116e01cadb03b68e2274" PRIMARY KEY ("roomID", "userID"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_5c71f2689991a90f2c0e8cf2a26" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_296c870f04718b47dc7b7fa54ca" FOREIGN KEY ("roomID") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "joined" ADD CONSTRAINT "FK_0cbfb62c46792d8ee11194d7c5a" FOREIGN KEY ("roomID") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "joined" ADD CONSTRAINT "FK_0e3b87daedfc5801698e9345118" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "joined" DROP CONSTRAINT "FK_0e3b87daedfc5801698e9345118"`);
        await queryRunner.query(`ALTER TABLE "joined" DROP CONSTRAINT "FK_0cbfb62c46792d8ee11194d7c5a"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_296c870f04718b47dc7b7fa54ca"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_5c71f2689991a90f2c0e8cf2a26"`);
        await queryRunner.query(`DROP TABLE "joined"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
