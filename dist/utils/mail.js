"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.EMAIL_HOST,
    port: parseInt(env_1.env.EMAIL_PORT),
    secure: env_1.env.EMAIL_PORT === "465",
    auth: {
        user: env_1.env.EMAIL_USER,
        pass: env_1.env.EMAIL_PASS,
    },
});
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Ethio Buna" <${env_1.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`📧 Email delivered: ${info.messageId}`);
    }
    catch (error) {
        console.error("❌ NODEMAILER ERROR:", error.message);
    }
};
exports.sendEmail = sendEmail;
