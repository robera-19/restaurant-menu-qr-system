"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
require("dotenv/config");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000'),
    DATABASE_URL: zod_1.z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
    JWT_SECRET: zod_1.z
        .string()
        .min(8, 'JWT_SECRET should be at least 8 characters long'),
    NODE_ENV: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
    EMAIL_HOST: zod_1.z.string().default('smtp.gmail.com'),
    EMAIL_PORT: zod_1.z.string().default('465'),
    EMAIL_USER: zod_1.z.string().email(),
    EMAIL_PASS: zod_1.z.string().min(1),
    APP_URL: zod_1.z.string().url(),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Invalid Environment Variables:', _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
