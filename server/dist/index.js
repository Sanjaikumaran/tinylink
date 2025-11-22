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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const publicLinks_1 = __importDefault(require("./routes/publicLinks"));
const health_1 = __importDefault(require("./routes/health"));
const db_1 = require("./db");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin ||
            origin.includes("*") ||
            origin.includes("localhost") ||
            origin.endsWith(".vercel.app")) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use("/healthz", health_1.default);
app.use("/api/links", publicLinks_1.default);
app.get("/:code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.params.code;
        if (!utils_1.CODE_REGEX.test(code)) {
            return res.status(404).send("Code not found");
        }
        const q = yield db_1.pool.query("SELECT target_url FROM links WHERE code=$1", [
            code,
        ]);
        if (q.rowCount === 0)
            return res.status(404).send("Data Not found");
        const target = q.rows[0].target_url;
        yield db_1.pool.query("UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code=$1", [code]);
        return res.status(200).json({ target });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
}));
(0, db_1.testDb)()
    .then(() => console.log("Database connected."))
    .catch((err) => console.error("Database connection failed:", err));
exports.default = app;
