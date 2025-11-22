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
const os_1 = __importDefault(require("os"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uptimeSeconds = process.uptime();
    const system = {
        hostname: os_1.default.hostname(),
        platform: os_1.default.platform(),
        arch: os_1.default.arch(),
        cpus: os_1.default.cpus().length,
        total_memory_mb: Math.round(os_1.default.totalmem() / 1024 / 1024),
        free_memory_mb: Math.round(os_1.default.freemem() / 1024 / 1024),
    };
    const processInfo = {
        uptime_seconds: uptimeSeconds,
        uptime_human: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`,
        memory_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
        node_version: process.version,
        pid: process.pid,
    };
    return res.status(200).json({
        ok: true,
        version: "1.0",
        timestamp: new Date().toISOString(),
        system,
        process: processInfo,
    });
}));
exports.default = router;
