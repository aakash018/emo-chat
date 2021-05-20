"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joined = void 0;
const typeorm_1 = require("typeorm");
const Rooms_1 = require("./Rooms");
const Users_1 = require("./Users");
let Joined = class Joined extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Joined.prototype, "roomID", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Rooms_1.Room, room => room.users),
    typeorm_1.JoinColumn({ name: "roomID" }),
    __metadata("design:type", Array)
], Joined.prototype, "users", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Joined.prototype, "userID", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.User, user => user.rooms),
    typeorm_1.JoinColumn({ name: "userID" }),
    __metadata("design:type", Array)
], Joined.prototype, "rooms", void 0);
Joined = __decorate([
    typeorm_1.Entity()
], Joined);
exports.Joined = Joined;
//# sourceMappingURL=Joined.js.map