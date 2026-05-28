import { Router } from 'express';
import * as RatingController from '../controllers/rating.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// PUBLIC: For customers to rate a dish
router.post('/', RatingController.submitRating);

// PUBLIC: For customers to see how many stars a dish has
router.get('/stats/:menuItemId', RatingController.getItemRatings);

// PROTECTED: Only Admins can see the names and private comments
router.get('/admin/all', protect, RatingController.getAdminFeedback);

export default router;
