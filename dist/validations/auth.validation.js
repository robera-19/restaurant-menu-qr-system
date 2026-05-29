"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z
            .string()
            .min(3, "Full name must be at least 3 characters")
            .max(100),
        email: zod_1.z.string().email("Invalid email format"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        role: zod_1.z
            .nativeEnum(client_1.Role, {
            errorMap: () => ({ message: "Invalid role. Use 'ADMIN' or 'STAFF'" }),
        })
            .optional(),
        profileImage: zod_1.z.string().url("Invalid image URL").optional().nullable(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format"),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, "Reset token is required"),
        password: zod_1.z.string().min(6, "New password must be at least 6 characters"),
    }),
});
