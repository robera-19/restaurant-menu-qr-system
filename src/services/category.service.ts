import prisma from "../config/prisma";

export const getAll = () =>
  prisma.category.findMany({ orderBy: { createdAt: "asc" } });

export const create = (name: string, adminId: string) =>
  prisma.category.create({
    data: { name, createdBy: adminId },
  });

export const update = (id: string, name: string) =>
  prisma.category.update({ where: { id }, data: { name } });

export const remove = (id: string) => prisma.category.delete({ where: { id } });
