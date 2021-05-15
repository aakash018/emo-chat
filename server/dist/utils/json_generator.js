"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (userInfo, expTime = "15m") => {
    return jsonwebtoken_1.default.sign({ user: userInfo }, "fsdfsdfsdfsdfsdf", { expiresIn: expTime });
};
exports.createToken = createToken;
const createRefToken = (data, expTime = "7d") => {
    return jsonwebtoken_1.default.sign(data, "dfdxcvsdfedfd", { expiresIn: expTime });
};
exports.createRefToken = createRefToken;
//# sourceMappingURL=json_generator.js.map