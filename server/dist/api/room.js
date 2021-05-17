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
const route = express_1.default();
route.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creator, serverName } = req.body;
    try {
        yield typeorm_1.getConnection()
            .createQueryBuilder()
            .insert()
            .into(Rooms_1.Room)
            .values({
            name: serverName,
            owner: creator,
        })
            .execute();
        res.send("Done");
    }
    catch (e) {
        console.log(e);
        res.send({
            ok: false,
            message: "Unknown server error"
        });
    }
}));
route.get("/getRooms", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield Rooms_1.Room.find();
    res.json(rooms);
}));
exports.default = route;
//# sourceMappingURL=room.js.map