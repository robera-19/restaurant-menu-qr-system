import { Router } from "express";
import * as CategoryController from "../controllers/category.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { categorySchema } from "../validations/category.validation";

const router = Router();

// PUBLIC: Customer needs this to build the Filter Bar
router.get("/", CategoryController.getCategories);

// PROTECTED: Admin only
router.post(
  "/",
  protect,
  validate(categorySchema),
  CategoryController.createCategory,
);
router.patch(
  "/:id",
  protect,
  validate(categorySchema),
  CategoryController.updateCategory,
);
router.delete("/:id", protect, CategoryController.deleteCategory);

export default router;
