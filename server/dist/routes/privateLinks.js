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
const authRequired_1 = require("../middleware/authRequired");
const utils_1 = require("../utils");
const valid_url_1 = __importDefault(require("valid-url"));
const router = (0, express_1.Router)();
router.use(authRequired_1.authRequired);
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: "unauthorized" });
        const { target_url: rawTarget, code: maybeCode } = (_b = req.body) !== null && _b !== void 0 ? _b : {};
        if (!rawTarget || typeof rawTarget !== "string")
            return res.status(400).json({ error: "target_url required" });
        const target_url = (0, utils_1.normalizeUrl)(rawTarget);
        if (!valid_url_1.default.isWebUri(target_url))
            return res.status(400).json({ error: "invalid target_url" });
        let code = maybeCode;
        if (code) {
            if (typeof code !== "string" || !utils_1.CODE_REGEX.test(code))
                return res
                    .status(400)
                    .json({ error: "code must match [A-Za-z0-9]{6,8}" });
        }
        else {
            let attempts = 0;
            do {
                code = (0, utils_1.generateRandomCode)(6);
                const { rowCount } = yield db_1.pool.query("SELECT 1 FROM links WHERE code=$1", [code]);
                if (rowCount === 0)
                    break;
                attempts++;
            } while (attempts < 5);
            if (!code)
                return res.status(500).json({ error: "could not generate code" });
        }
        const created = yield db_1.pool
            .query(`INSERT INTO links (code, target_url, user_id, total_clicks, last_clicked, created_at)
       VALUES ($1, $2, $3, 0, NULL, now())
       RETURNING code, target_url, created_at, total_clicks, last_clicked`, [code, target_url, userId])
            .catch((err) => {
            if (err.code === "23505")
                return { duplicate: true };
            throw err;
        });
        if (created.duplicate) {
            return res.status(409).json({ error: "code already exists" });
        }
        const row = created.rows[0];
        const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        return res.status(201).json({
            code: row.code,
            target_url: row.target_url,
            shortUrl: `${base}/${row.code}`,
            created_at: row.created_at,
            total_clicks: Number(row.total_clicks),
            last_clicked: row.last_clicked,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal error" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: "unauthorized" });
        const q = yield db_1.pool.query("SELECT code, target_url, created_at, total_clicks, last_clicked FROM links WHERE user_id=$1 ORDER BY created_at DESC", [userId]);
        return res.json(q.rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal error" });
    }
}));
router.get("/:code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const code = req.params.code;
        if (!userId)
            return res.status(401).json({ error: "unauthorized" });
        if (!utils_1.CODE_REGEX.test(code))
            return res.status(400).json({ error: "invalid code" });
        const q = yield db_1.pool.query("SELECT code, target_url, created_at, total_clicks, last_clicked FROM links WHERE code=$1 AND user_id=$2", [code, userId]);
        if (q.rowCount === 0)
            return res.status(404).json({ error: "not found" });
        return res.json(q.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal error" });
    }
}));
router.delete("/:code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const code = req.params.code;
        if (!userId)
            return res.status(401).json({ error: "unauthorized" });
        if (!utils_1.CODE_REGEX.test(code))
            return res.status(400).json({ error: "invalid code" });
        const del = yield db_1.pool.query("DELETE FROM links WHERE code=$1 AND user_id=$2 RETURNING code", [code, userId]);
        if (del.rowCount === 0)
            return res.status(404).json({ error: "not found" });
        return res.status(204).send();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal error" });
    }
}));
exports.default = router;
