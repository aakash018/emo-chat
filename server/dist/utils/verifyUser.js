"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateUser = (req, res, next) => {
    const { token } = req.body;
    if (token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN);
            if (payload) {
                next();
            }
        }
        catch (_a) {
            return res.json({
                ok: false,
                message: "invalid token"
            });
        }
    }
    else {
        return res.json({
            ok: false,
            message: "No Token Found"
        });
    }
};
exports.validateUser = validateUser;
//# sourceMappingURL=verifyUser.js.map