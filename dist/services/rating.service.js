"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
exports.RatingService = {
    create: async (data) => {
        return await prisma_1.default.rating.create({
            data: {
                menuItemId: data.menuItemId,
                ratingValue: data.ratingValue,
                customerName: data.customerName || 'Anonymous',
                comment: data.comment,
                qrCodeId: data.qrCodeId,
            },
        });
    },
    // 2. FOR ADMIN: Get full feedback list with names and comments
    getAdminFeedback: async () => {
        return await prisma_1.default.rating.findMany({
            include: {
                menuItem: { select: { name: true } },
                qrCode: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    // 3. FOR ADMIN: Get specific stats for an item
    getItemFeedbackDetails: async (menuItemId) => {
        return await prisma_1.default.rating.findMany({
            where: { menuItemId },
            orderBy: { createdAt: 'desc' },
        });
    },
};
