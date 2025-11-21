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
const express_1 = require("express");
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
        if (!email || !password)
            return res.status(400).json({ error: "email and password required" });
        const hash = yield bcrypt_1.default.hash(password, 10);
        const q = yield db_1.pool.query("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at", [email, hash]);
        const user = q.rows[0];
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
        res.status(201).json({ token });
    }
    catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({ error: "email already exists" });
        }
        console.error(err);
        res.status(500).json({ error: "internal error" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
        if (!email || !password)
            return res.status(400).json({ error: "email and password required" });
        const q = yield db_1.pool.query("SELECT id, email, password_hash FROM users WHERE email=$1", [email]);
        if (q.rowCount === 0)
            return res.status(401).json({ error: "invalid credentials" });
        const user = q.rows[0];
        const ok = yield bcrypt_1.default.compare(password, user.password_hash);
        if (!ok)
            return res.status(401).json({ error: "invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
        res.json({ token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal error" });
    }
}));
exports.default = router;
