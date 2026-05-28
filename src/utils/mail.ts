import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: parseInt(env.EMAIL_PORT),
  secure: env.EMAIL_PORT === "465",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ethio Buna" <${env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email delivered: ${info.messageId}`);
  } catch (error: any) {
    console.error("❌ NODEMAILER ERROR:", error.message);
  }
};
