"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemRatings = exports.getAdminFeedback = exports.submitRating = void 0;
const rating_service_1 = require("../services/rating.service");
const submitRating = async (req, res, next) => {
    try {
        const rating = await rating_service_1.RatingService.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback!',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.submitRating = submitRating;
const getAdminFeedback = async (req, res, next) => {
    try {
        const feedbacks = await rating_service_1.RatingService.getAdminFeedback();
        res.json({
            success: true,
            data: feedbacks,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminFeedback = getAdminFeedback;
/**
 * 3. GET ITEM FEEDBACK STATS (Public)
 * Returns only the stats for a specific dish, NOT the comments.
 */
const getItemRatings = async (req, res, next) => {
    try {
        const { menuItemId } = req.params;
        const ratings = await rating_service_1.RatingService.getItemFeedbackDetails(menuItemId);
        const total = ratings.reduce((sum, r) => sum + r.ratingValue, 0);
        const average = ratings.length > 0 ? (total / ratings.length).toFixed(1) : 0;
        res.json({
            success: true,
            data: {
                averageRating: parseFloat(average.toString()),
                totalReviews: ratings.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getItemRatings = getItemRatings;
