import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../config/prisma";

export const findByEmail = (email: string) =>
  prisma.admin.findUnique({ where: { email } });

export const findById = (id: string) =>
  prisma.admin.findUnique({ where: { id } });

export const findByVerificationToken = (token: string) =>
  prisma.admin.findFirst({ where: { verificationToken: token } });

export const findByResetToken = (token: string) =>
  prisma.admin.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });

export const create = async (data: any) => {
  const passwordHash = await bcrypt.hash(data.password, 12);
  const vToken = crypto.randomBytes(32).toString("hex");

  return prisma.admin.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      passwordHash,
      verificationToken: vToken,
      role: data.role || "ADMIN",
      profileImage: data.profileImage || null,
    },
  });
};

export const update = (id: string, data: any) =>
  prisma.admin.update({ where: { id }, data });
