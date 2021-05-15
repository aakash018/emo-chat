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
require("./config/passport");
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_1 = __importDefault(require("./api/auth"));
const typeorm_1 = require("typeorm");
const Users_1 = require("./entities/Users");
const app = express_1.default();
app.use(cookie_parser_1.default());
app.use(cors_1.default({
    origin: "http://localhost:3000",
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
        entities: [Users_1.User],
        synchronize: true,
        logging: false,
    }).then(_ => {
        console.log("Connected To PSQL");
    }).catch(error => console.log(error));
}))();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(passport_1.default.initialize());
app.use("/auth", auth_1.default);
app.get("/", (_, res) => {
    res.send(`Server running at: ${PORT}`);
});
server.listen(PORT, () => {
    console.log("Server at PORT:", PORT);
});
//# sourceMappingURL=server.js.map