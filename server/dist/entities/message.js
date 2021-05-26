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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const Rooms_1 = require("./Rooms");
const Users_1 = require("./Users");
let Message = class Message extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "message", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "userID", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.User, user => user),
    typeorm_1.JoinColumn({ name: "userID" }),
    __metadata("design:type", Users_1.User)
], Message.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "roomID", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Rooms_1.Room, room => room.messages),
    typeorm_1.JoinColumn({ name: "roomID" }),
    __metadata("design:type", Rooms_1.Room)
], Message.prototype, "room", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Message.prototype, "updatedAt", void 0);
Message = __decorate([
    typeorm_1.Entity()
], Message);
exports.Message = Message;
//# sourceMappingURL=message.js.map