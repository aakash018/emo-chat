"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRefactoring1634646718108 = void 0;
class PostRefactoring1634646718108 {
    constructor() {
        this.name = 'PostRefactoring1634646718108';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "displayName" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "picture" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "flag" character varying, "userID" uuid NOT NULL, "roomID" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "owner" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "joined" ("roomID" uuid NOT NULL, "userID" uuid NOT NULL, CONSTRAINT "PK_b0a4633116e01cadb03b68e2274" PRIMARY KEY ("roomID", "userID"))`);
            yield queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_5c71f2689991a90f2c0e8cf2a26" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_296c870f04718b47dc7b7fa54ca" FOREIGN KEY ("roomID") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "joined" ADD CONSTRAINT "FK_0cbfb62c46792d8ee11194d7c5a" FOREIGN KEY ("roomID") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "joined" ADD CONSTRAINT "FK_0e3b87daedfc5801698e9345118" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "joined" DROP CONSTRAINT "FK_0e3b87daedfc5801698e9345118"`);
            yield queryRunner.query(`ALTER TABLE "joined" DROP CONSTRAINT "FK_0cbfb62c46792d8ee11194d7c5a"`);
            yield queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_296c870f04718b47dc7b7fa54ca"`);
            yield queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_5c71f2689991a90f2c0e8cf2a26"`);
            yield queryRunner.query(`DROP TABLE "joined"`);
            yield queryRunner.query(`DROP TABLE "room"`);
            yield queryRunner.query(`DROP TABLE "message"`);
            yield queryRunner.query(`DROP TABLE "user"`);
        });
    }
}
exports.PostRefactoring1634646718108 = PostRefactoring1634646718108;
//# sourceMappingURL=1634646718108-PostRefactoring.js.map