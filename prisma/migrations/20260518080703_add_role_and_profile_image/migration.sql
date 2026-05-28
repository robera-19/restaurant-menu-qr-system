-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "role" VARCHAR(50) NOT NULL DEFAULT 'ADMIN';
