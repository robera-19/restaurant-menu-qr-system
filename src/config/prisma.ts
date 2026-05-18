import { PrismaClient } from "@prisma/client";
import { env } from "./env";

/**
 * We use a global variable to store the Prisma instance
 * during development to prevent connection leaks caused
 * by Hot Module Replacement (HMR).
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Only log SQL queries in development mode
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
