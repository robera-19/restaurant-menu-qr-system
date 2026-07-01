import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import * as AuthService from '../services/auth.service';
import { env } from '../config/env';
import { sendEmail } from '../utils/mail';
import { verificationEmail } from '../emails/verification-email';
import { resetPasswordEmail } from '../emails/reset-password-email';

const signToken = (id: string, role: string) =>
  jwt.sign({ id, role }, env.JWT_SECRET, { expiresIn: '1d' });

// 1. REGISTER
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const exists = await AuthService.findByEmail(req.body.email);
    if (exists) return res.status(400).json({ message: 'Email taken' });

    const admin = await AuthService.create(req.body);

    const verifyUrl = `${env.APP_URL}/verify-email?token=${admin.verificationToken}`;
    await sendEmail({
      to: admin.email,
      subject: 'Verify your email',
      html: verificationEmail(admin.fullName, verifyUrl),
    });

    res
      .status(201)
      .json({ message: 'Registered! Please check your email to verify.' });
  } catch (error) {
    next(error);
  }
};

// 2. VERIFY EMAIL
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = await AuthService.findByVerificationToken(
      req.query.token as string,
    );
    if (!admin) return res.status(400).json({ message: 'Invalid token' });

    await AuthService.update(admin.id, {
      isVerified: true,
      verificationToken: null,
    });
    res.json({ message: 'Email verified! You can now login.' });
  } catch (error) {
    next(error);
  }
};

// 3. LOGIN
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const admin = await AuthService.findByEmail(email);

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!admin.isVerified)
      return res.status(401).json({ message: 'Verify email first' });

    const token = signToken(admin.id, admin.role);
    res.json({ token, admin });
  } catch (error) {
    next(error);
  }
};

// 4. FORGOT PASSWORD
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = await AuthService.findByEmail(req.body.email);
    if (!admin)
      return res.json({ message: 'If email exists, a link was sent' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await AuthService.update(admin.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 3600000),
    });

    const resetUrl = `${env.APP_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: admin.email,
      subject: 'Reset Password',
      html: resetPasswordEmail(admin.fullName, resetUrl),
    });

    res.json({ message: 'Check your email for the reset link' });
  } catch (error) {
    next(error);
  }
};

// 5. RESET PASSWORD
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, password } = req.body;
    const admin = await AuthService.findByResetToken(token);
    if (!admin)
      return res.status(400).json({ message: 'Token invalid or expired' });

    const passwordHash = await bcrypt.hash(password, 12);
    await AuthService.update(admin.id, {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// 6. LOGOUT
export const logout = (req: Request, res: Response) => {
  res.json({ message: 'Logged out. Delete token from frontend.' });
};

// 7. GET ME
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // req.user was attached by the 'protect' middleware
    const adminId = (req as any).user.id;
    const admin = await AuthService.findById(adminId);

    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json({ admin });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

    const token = crypto.randomBytes(32).toString('hex');

    await AuthService.update(admin.id, {
      verificationToken: token,
    });

    const verifyUrl = `${env.APP_URL}/verify-email?token=${token}`;

    await sendEmail({
      to: admin.email,
      subject: 'Verify your email',
      html: verificationEmail(admin.fullName, verifyUrl),
    });

    res.json({
      message: 'Verification email sent.',
    });
  } catch (error) {
    next(error);
  }
};