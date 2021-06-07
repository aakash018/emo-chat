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
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
require("./config/passport");
require("reflect-metadata");
const auth_1 = __importDefault(require("./api/auth"));
const room_1 = __importDefault(require("./api/room"));
const typeorm_1 = require("typeorm");
const Users_1 = require("./entities/Users");
const Rooms_1 = require("./entities/Rooms");
const message_1 = require("./entities/message");
const Joined_1 = require("./entities/Joined");
const onlineClients_1 = require("./onlineClients");
const app = express_1.default();
app.use(cookie_parser_1.default());
app.use(cors_1.default({
    origin: process.env.CLIENT_END_POINT,
    credentials: true
}));
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 5000;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "Thisisme@123",
        database: "emochat",
        entities: [Users_1.User, Rooms_1.Room, message_1.Message, Joined_1.Joined],
        synchronize: true,
        logging: false,
    }).then((_) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Connected To PSQL");
    })).catch(error => console.log(error));
}))();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_END_POINT,
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    socket.on("disconnect", () => {
        onlineClients_1.removeOnlineClient(socket.id);
        socket.broadcast.emit("online-clients", { ok: true, clients: onlineClients_1.getOnlineClients() });
    });
    socket.on("user-loged-on", (data) => {
        onlineClients_1.addOnlienClients(data.userID, socket.id);
        socket.broadcast.emit("online-clients", { ok: true, clients: onlineClients_1.getOnlineClients() });
    });
    socket.on("getOnlineClients", (data) => {
        io.to(data.userID).emit("online-clients", { ok: true, clients: onlineClients_1.getOnlineClients() });
    });
    socket.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const newMessage = yield message_1.Message.create({
            message: msg.message,
            roomID: msg.roomID,
            userID: msg.userID
        }).save();
        const payload = {
            message: msg.message,
            createdAt: Date.now(),
            id: newMessage.id,
            user: {
                id: msg.userID,
                firstName: msg.firstName,
                picture: msg.picture
            }
        };
        console.log(onlineClients_1.getOnlineClients());
        io.to(msg.roomID).emit("message", payload);
    }));
    socket.on("join", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const doesRoomExists = yield Rooms_1.Room.findOne(data.id);
        if (!doesRoomExists) {
            return;
        }
        socket.join(data.id);
        socket.join(data.userID);
        if (data.currentRoom) {
            socket.leave(data.currentRoom);
        }
        const joinedRooms = yield typeorm_1.getConnection()
            .getRepository(Users_1.User)
            .findOne({ id: data.userID }, { relations: ["rooms"] });
        if (joinedRooms === null || joinedRooms === void 0 ? void 0 : joinedRooms.rooms.every(room => room.roomID !== data.id)) {
            console.log("--------------Emmited-------------------");
            io.to(data.id).emit("a-user-joined", {
                ok: true, user: {
                    userID: data.userID,
                    rooms: {
                        displayName: data.displayName,
                        picture: data.picture
                    }
                }
            });
        }
        io.to(data.userID).emit("joined", { ok: true, id: data.id });
    }));
    socket.on("unsend", (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            io.to(data.roomID).emit("unsend", { ok: true, messageID: data.messageID });
            yield message_1.Message.delete({ id: data.messageID });
        }
        catch (_a) {
            io.to(data.roomID).emit("unsend", { ok: false, message: "failed to update message data" });
        }
    }));
    socket.on("user-left-room", (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield Joined_1.Joined.delete({
            userID: data.userID,
            roomID: data.roomID
        });
        io.to(data.userID).emit("user-left-room", { ok: true, roomID: data.roomID });
        io.to(data.roomID).emit("updateList", { ok: true, userID: data.userID });
        socket.leave(data.roomID);
    }));
});
app.use(passport_1.default.initialize());
app.use("/auth", auth_1.default);
app.use("/api/room", room_1.default);
app.get("/", (_, res) => {
    res.send(`Server running at: ${PORT}`);
});
server.listen(PORT, () => {
    console.log("Server at PORT:", PORT);
});
//# sourceMappingURL=server.js.map