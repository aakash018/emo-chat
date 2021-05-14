"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const route = express_1.default();
route.get('/google', passport_1.default.authenticate('google', {
    scope: ['email', 'profile']
}));
route.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/auth/google/failure',
    session: false,
}), (req, res) => {
    res.set("dsfsdf-sfsdf", "sdfsdfsdfsdf");
    res.json(req.user);
});
route.get("/google/failure", (_, res) => {
    return res.send("Failed");
});
exports.default = route;
//# sourceMappingURL=auth.js.map