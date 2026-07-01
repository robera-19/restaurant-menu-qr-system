"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerification = exports.getMe = exports.logout = exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const AuthService = __importStar(require("../services/auth.service"));
const env_1 = require("../config/env");
const mail_1 = require("../utils/mail");
const verification_email_1 = require("../emails/verification-email");
const reset_password_email_1 = require("../emails/reset-password-email");
const signToken = (id, role) => jsonwebtoken_1.default.sign({ id, role }, env_1.env.JWT_SECRET, { expiresIn: '1d' });
// 1. REGISTER
const register = async (req, res, next) => {
    try {
        const exists = await AuthService.findByEmail(req.body.email);
        if (exists)
            return res.status(400).json({ message: 'Email taken' });
        const admin = await AuthService.create(req.body);
        const verifyUrl = `${env_1.env.APP_URL}/verify-email?token=${admin.verificationToken}`;
        await (0, mail_1.sendEmail)({
            to: admin.email,
            subject: 'Verify your email',
            html: (0, verification_email_1.verificationEmail)(admin.fullName, verifyUrl),
        });
        res
            .status(201)
            .json({ message: 'Registered! Please check your email to verify.' });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// 2. VERIFY EMAIL
const verifyEmail = async (req, res, next) => {
    try {
        const admin = await AuthService.findByVerificationToken(req.query.token);
        if (!admin)
            return res.status(400).json({ message: 'Invalid token' });
        await AuthService.update(admin.id, {
            isVerified: true,
            verificationToken: null,
        });
        res.json({ message: 'Email verified! You can now login.' });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyEmail = verifyEmail;
// 3. LOGIN
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await AuthService.findByEmail(email);
        if (!admin || !(await bcryptjs_1.default.compare(password, admin.passwordHash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!admin.isVerified)
            return res.status(401).json({ message: 'Verify email first' });
        const token = signToken(admin.id, admin.role);
        res.json({ token, admin });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// 4. FORGOT PASSWORD
const forgotPassword = async (req, res, next) => {
    try {
        const admin = await AuthService.findByEmail(req.body.email);
        if (!admin)
            return res.json({ message: 'If email exists, a link was sent' });
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        await AuthService.update(admin.id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: new Date(Date.now() + 3600000),
        });
        const resetUrl = `${env_1.env.APP_URL}/reset-password?token=${resetToken}`;
        await (0, mail_1.sendEmail)({
            to: admin.email,
            subject: 'Reset Password',
            html: (0, reset_password_email_1.resetPasswordEmail)(admin.fullName, resetUrl),
        });
        res.json({ message: 'Check your email for the reset link' });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
// 5. RESET PASSWORD
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const admin = await AuthService.findByResetToken(token);
        if (!admin)
            return res.status(400).json({ message: 'Token invalid or expired' });
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        await AuthService.update(admin.id, {
            passwordHash,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
// 6. LOGOUT
const logout = (req, res) => {
    res.json({ message: 'Logged out. Delete token from frontend.' });
};
exports.logout = logout;
// 7. GET ME
const getMe = async (req, res, next) => {
    try {
        // req.user was attached by the 'protect' middleware
        const adminId = req.user.id;
        const admin = await AuthService.findById(adminId);
        if (!admin)
            return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json({ admin });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const resendVerification = async (req, res, next) => {
    try {
        const admin = await AuthService.findByEmail(req.body.email);
        if (!admin)
            return res.json({
                message: 'If the email exists, a verification email has been sent.',
            });
        if (admin.isVerified)
            return res.status(400).json({
                message: 'Email is already verified.',
            });
        const token = crypto_1.default.randomBytes(32).toString('hex');
        await AuthService.update(admin.id, {
            verificationToken: token,
        });
        const verifyUrl = `${env_1.env.APP_URL}/verify-email?token=${token}`;
        await (0, mail_1.sendEmail)({
            to: admin.email,
            subject: 'Verify your email',
            html: (0, verification_email_1.verificationEmail)(admin.fullName, verifyUrl),
        });
        res.json({
            message: 'Verification email sent.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resendVerification = resendVerification;
