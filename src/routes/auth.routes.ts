import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.get("/verify-email", AuthController.verifyEmail);
router.post("/login", validate(loginSchema), AuthController.login);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  AuthController.forgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  AuthController.resetPassword,
);
router.get("/logout", AuthController.logout);

router.get("/me", protect, AuthController.getMe);

export default router;
