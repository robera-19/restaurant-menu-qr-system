"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSchema = exports.updateMenuItemSchema = exports.createMenuItemSchema = void 0;
const zod_1 = require("zod");
exports.createMenuItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        categoryId: zod_1.z.string().uuid("Category is required"),
        price: zod_1.z.number().positive("Price must be a positive number"),
        // Optional fields must use .nullable().optional()
        oldPrice: zod_1.z.number().nullable().optional(),
        description: zod_1.z.string().nullable().optional(),
        preparationTime: zod_1.z.number().int().nullable().optional(),
        spicyLevel: zod_1.z.number().int().min(0).max(3).default(0),
        isFeatured: zod_1.z.boolean().default(false),
        isAvailable: zod_1.z.boolean().default(true),
        ingredients: zod_1.z.array(zod_1.z.string()).default([]),
        allergens: zod_1.z.array(zod_1.z.string()).default([]),
        calories: zod_1.z.number().int().nullable().optional(),
        protein: zod_1.z.string().nullable().optional(),
        carbs: zod_1.z.string().nullable().optional(),
        fat: zod_1.z.string().nullable().optional(),
        images: zod_1.z
            .array(zod_1.z.object({
            imageUrl: zod_1.z.string().url(),
            isPrimary: zod_1.z.boolean(),
        }))
            .optional(),
    }),
});
exports.updateMenuItemSchema = zod_1.z.object({
    body: exports.createMenuItemSchema.shape.body.partial(),
});
exports.toggleSchema = zod_1.z.object({
    body: zod_1.z.object({ isAvailable: zod_1.z.boolean() }),
});
