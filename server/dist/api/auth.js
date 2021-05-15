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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const Users_1 = require("../entities/Users");
const json_generator_1 = require("../utils/json_generator");
const route = express_1.default();
route.get('/google', passport_1.default.authenticate('google', {
    scope: ['email', 'profile']
}));
route.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/auth/google/failure',
    session: false,
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        const currentUser = yield Users_1.User.findOne({ where: { email: req.user.email } });
        res.clearCookie("ref");
        res.cookie("ref", json_generator_1.createRefToken({ userID: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id }), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.redirect("http://localhost:3000/dash");
    }
}));
route.get('/getToken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.ref;
    console.log(req.headers);
    console.log(token);
    if (!token) {
        return res.json({ ok: false, message: "No Token Found" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, "dfdxcvsdfedfd");
        if (payload) {
            const user = yield Users_1.User.findOne({ where: { id: payload.userID } });
            if (user) {
                return res.json({
                    token: json_generator_1.createToken(user)
                });
            }
        }
        else {
            return res.json({ ok: false, message: "Error validating token" });
        }
    }
    catch (e) {
        console.log("JWT Ref error", e);
        return res.json({ ok: false, message: "Unknown error !!" });
    }
}));
route.get("/google/failure", (_, res) => {
    return res.send("Failed");
});
exports.default = route;
//# sourceMappingURL=auth.js.map