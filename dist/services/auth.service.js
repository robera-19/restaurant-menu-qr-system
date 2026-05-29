"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.findByResetToken = exports.findByVerificationToken = exports.findById = exports.findByEmail = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../config/prisma"));
const findByEmail = (email) => prisma_1.default.admin.findUnique({ where: { email } });
exports.findByEmail = findByEmail;
const findById = (id) => prisma_1.default.admin.findUnique({ where: { id } });
exports.findById = findById;
const findByVerificationToken = (token) => prisma_1.default.admin.findFirst({ where: { verificationToken: token } });
exports.findByVerificationToken = findByVerificationToken;
const findByResetToken = (token) => prisma_1.default.admin.findFirst({
    where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
    },
});
exports.findByResetToken = findByResetToken;
const create = async (data) => {
    const passwordHash = await bcrypt_1.default.hash(data.password, 12);
    const vToken = crypto_1.default.randomBytes(32).toString("hex");
    return prisma_1.default.admin.create({
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
exports.create = create;
const update = (id, data) => prisma_1.default.admin.update({ where: { id }, data });
exports.update = update;
