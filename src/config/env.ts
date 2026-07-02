import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  JWT_SECRET: z
    .string()
    .min(8, 'JWT_SECRET should be at least 8 characters long'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3001'),

  APP_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid Environment Variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
