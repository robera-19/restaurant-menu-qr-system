"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrService = void 0;
const prisma_1 = require("../config/prisma");
const nanoid_1 = require("nanoid");
const qrcode_1 = __importDefault(require("qrcode"));
const env_1 = require("../config/env");
exports.QrService = {
    // 1. Create a new QR entry in DB
    create: async (name, adminId) => {
        return await prisma_1.prisma.qrCode.create({
            data: {
                name,
                createdBy: adminId,
                shortId: (0, nanoid_1.nanoid)(6), // Generates a unique 6-char ID like "aB9x2p"
            },
        });
    },
    // 2. Find QR by shortId for the redirector
    getByShortId: (shortId) => prisma_1.prisma.qrCode.findUnique({ where: { shortId } }),
    // 3. Log the scan for Analytics
    logScan: async (qrCodeId) => {
        return await prisma_1.prisma.qrScan.create({
            data: { qrCodeId },
        });
    },
    // 4. Generate the actual printable QR image
    generateImage: async (shortId) => {
        const redirectUrl = `http://localhost:${env_1.env.PORT}/q/${shortId}`;
        // Returns a Base64 Data URL that you can put in an <img src="...">
        return await qrcode_1.default.toDataURL(redirectUrl, {
            width: 512,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        });
    },
    // 5. Get all QRs for the Admin list
    getAll: () => prisma_1.prisma.qrCode.findMany({
        include: { _count: { select: { scans: true } } },
        orderBy: { createdAt: "desc" },
    }),
};
