"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAll = () => prisma_1.default.category.findMany({ orderBy: { createdAt: "asc" } });
exports.getAll = getAll;
const create = (name, adminId) => prisma_1.default.category.create({
    data: { name, createdBy: adminId },
});
exports.create = create;
const update = (id, name) => prisma_1.default.category.update({ where: { id }, data: { name } });
exports.update = update;
const remove = (id) => prisma_1.default.category.delete({ where: { id } });
exports.remove = remove;
