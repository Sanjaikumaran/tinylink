"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = authRequired;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authRequired(req, res, next) {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: "No token" });
    const parts = header.split(" ");
    if (parts.length !== 2)
        return res.status(401).json({ error: "Invalid auth header" });
    const token = parts[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
