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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Rooms_1 = require("../entities/Rooms");
const typeorm_1 = require("typeorm");
const verifyUser_1 = require("../utils/verifyUser");
const Joined_1 = require("../entities/Joined");
const Users_1 = require("../entities/Users");
const message_1 = require("../entities/message");
const route = express_1.default();
route.post("/add", verifyUser_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { serverName } = req.body;
    const creator = (_a = req.user) === null || _a === void 0 ? void 0 : _a.displayName;
    try {
        const newRoom = yield Rooms_1.Room.create({
            name: serverName,
            owner: creator
        }).save();
        yield Joined_1.Joined.create({
            roomID: newRoom === null || newRoom === void 0 ? void 0 : newRoom.id,
            userID: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id
        }).save();
        res.json({
            ok: true,
            room: newRoom
        });
    }
    catch (e) {
        console.log(e);
        res.send({
            ok: false,
            message: "Unknown server error"
        });
    }
}));
route.post("/joinRoom", verifyUser_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { roomID } = req.body;
    const joinedRooms = yield typeorm_1.getConnection()
        .getRepository(Users_1.User)
        .findOne({ id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id }, { relations: ["rooms"] });
    if (joinedRooms === null || joinedRooms === void 0 ? void 0 : joinedRooms.rooms.every(room => room.roomID !== roomID)) {
        try {
            yield Joined_1.Joined.create({
                roomID,
                userID: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id
            }).save();
        }
        catch (e) {
            console.log(e);
            res.json({
                ok: false,
                message: "Error while saving"
            });
        }
    }
    else {
        res.json({
            ok: false,
            message: "room alreaddy joined"
        });
    }
}));
route.get("/search", verifyUser_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchQuery } = req.query;
    try {
        const rooms = yield typeorm_1.getConnection()
            .getRepository(Rooms_1.Room)
            .createQueryBuilder("room")
            .where("room.name LIKE :name", { name: `%${searchQuery}%` })
            .getMany();
        res.json({
            ok: true,
            rooms
        });
    }
    catch (e) {
        console.log(e);
        res.json({
            ok: false,
            message: "server error"
        });
    }
}));
route.get("/getRooms", verifyUser_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRooms = yield typeorm_1.getConnection().getRepository(Rooms_1.Room).find({ relations: ["users"] });
        const rooms = allRooms.filter(room => room.users.some(user => { var _a; return user.userID === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); }));
        res.json({
            ok: true,
            rooms
        });
    }
    catch (e) {
        console.log(e);
        res.json({
            ok: false,
            message: "Error saving"
        });
    }
}));
route.get("/messages", verifyUser_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomID } = req.query;
    const messages = yield typeorm_1.getConnection().getRepository(message_1.Message)
        .createQueryBuilder("message")
        .where("message.roomID = :id", { id: roomID })
        .leftJoinAndSelect('message.user', 'user')
        .select(["message", "user.firstName", "user.picture", "user.id"])
        .orderBy("message.createdAt", "ASC")
        .getMany();
    res.json({
        ok: true,
        messages: messages
    });
}));
route.get("/users", verifyUser_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomID } = req.query;
    const currentRoom = yield typeorm_1.getConnection().getRepository(Joined_1.Joined)
        .createQueryBuilder("joined")
        .where("joined.roomID = :id", { id: roomID })
        .leftJoinAndSelect('joined.rooms', 'users')
        .select(["joined", "users.displayName", "users.picture"])
        .getMany();
    res.json({
        ok: true,
        users: currentRoom
    });
}));
exports.default = route;
//# sourceMappingURL=room.js.map