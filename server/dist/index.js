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
const privateLinks_1 = __importDefault(require("./routes/privateLinks"));
const auth_1 = __importDefault(require("./routes/auth"));
const db_1 = require("./db");
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", // local frontend
        /\.vercel\.app$/, // production frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", (0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get("/healthz", (req, res) => {
    return res.json({ ok: true, version: "1.0" });
});
// Public & private APIs
app.use("/api/links", publicLinks_1.default);
app.use("/api/private/links", privateLinks_1.default);
app.use("/api/auth", auth_1.default);
// Redirect handler
app.get("/:code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.params.code;
        if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
            return res.status(404).send("Not found");
        }
        const q = yield db_1.pool.query("SELECT target_url FROM links WHERE code=$1", [
            code,
        ]);
        if (q.rowCount === 0)
            return res.status(404).send("Not found");
        const target = q.rows[0].target_url;
        yield db_1.pool.query("UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code=$1", [code]);
        return res.redirect(302, target);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
}));
const PORT = Number(process.env.PORT || 5000);
(0, db_1.testDb)()
    .then(() => {
    console.log("Database connected.");
})
    .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
});
// Start server
app.listen(PORT, () => {
    console.log(`TinyLink server running at http://localhost:${PORT}`);
});
