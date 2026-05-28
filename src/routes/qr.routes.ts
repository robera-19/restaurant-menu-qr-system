import { Router } from "express";
import * as QrController from "../controllers/qr.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createQrSchema } from "../validations/qr.validation";

const router = Router();

router.post("/", protect, validate(createQrSchema), QrController.createQr);
router.get("/", protect, QrController.listQrs);
router.get("/:shortId/image", protect, QrController.getQrImage);

export default router;
