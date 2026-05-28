import { Router } from 'express';
import * as MenuController from '../controllers/menu.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createMenuItemSchema,
  updateMenuItemSchema,
  toggleSchema,
} from '../validations/menu.validation';
import upload from '../middlewares/upload.middleware';

const router = Router();

router.get('/', MenuController.getMenu);

router.post('/', protect, upload.array('images', 10), MenuController.create);

// Admin Management
router.post(
  '/',
  protect,
  validate(createMenuItemSchema),
  upload.array('images', 10),
  MenuController.create,
);
router.put(
  '/:id',
  protect,
  validate(updateMenuItemSchema),
  upload.array('images', 10),
  MenuController.updateItem,
);
router.patch(
  '/:id/toggle',
  protect,
  validate(toggleSchema),
  MenuController.toggleAvailability,
);
router.delete('/:id', protect, MenuController.deleteItem);

export default router;
