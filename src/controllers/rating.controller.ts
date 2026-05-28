import { Request, Response, NextFunction } from 'express';
import { RatingService } from '../services/rating.service';

export const submitRating = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rating = await RatingService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const feedbacks = await RatingService.getAdminFeedback();

    res.json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. GET ITEM FEEDBACK STATS (Public)
 * Returns only the stats for a specific dish, NOT the comments.
 */
export const getItemRatings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { menuItemId } = req.params;
    const ratings = await RatingService.getItemFeedbackDetails(menuItemId);

    const total = ratings.reduce((sum, r) => sum + r.ratingValue, 0);
    const average =
      ratings.length > 0 ? (total / ratings.length).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        averageRating: parseFloat(average.toString()),
        totalReviews: ratings.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
