"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.getOverview = void 0;
const analytics_service_1 = require("../services/analytics.service");
const getOverview = async (req, res, next) => {
    try {
        const stats = await analytics_service_1.AnalyticsService.getOverviewData();
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOverview = getOverview;
const getStats = async (req, res, next) => {
    try {
        const performance = await analytics_service_1.AnalyticsService.getPerformanceData();
        res.json({
            success: true,
            data: performance,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStats = getStats;
