import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export const getOverview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await AnalyticsService.getOverviewData();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const performance = await AnalyticsService.getPerformanceData();

    res.json({
      success: true,
      data: performance,
    });
  } catch (error) {
    next(error);
  }
};
