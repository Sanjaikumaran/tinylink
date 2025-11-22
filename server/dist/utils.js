"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CODE_REGEX = void 0;
exports.generateRandomCode = generateRandomCode;
exports.normalizeUrl = normalizeUrl;
exports.CODE_REGEX = /^[A-Za-z0-9]+$/;
function generateRandomCode(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < length; i++)
        out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}
function normalizeUrl(url) {
    if (!/^https?:\/\//i.test(url))
        return `https://${url}`;
    return url;
}
