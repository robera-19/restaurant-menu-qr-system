"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendEmail({ to, subject, html }) {
    try {
        const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
        if (error) {
            throw error;
        }
    }
    catch (error) {
        console.error('Email Error:', error);
        throw error;
    }
}
