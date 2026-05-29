"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRatingSchema = void 0;
const zod_1 = require("zod");
exports.createRatingSchema = zod_1.z.object({
    body: zod_1.z.object({
        menuItemId: zod_1.z.string().uuid("Invalid menu item"),
        ratingValue: zod_1.z
            .number()
            .int()
            .min(1)
            .max(5, "Rating must be between 1 and 5"),
        customerName: zod_1.z.string().max(100).optional().nullable(),
        comment: zod_1.z.string().max(500).optional().nullable(),
        qrCodeId: zod_1.z.string().uuid().optional().nullable(), // To track the table
    }),
});
