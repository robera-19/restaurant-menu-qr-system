"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../config/prisma");
exports.AnalyticsService = {
    getOverviewData: async () => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const [todayScans, outOfStock, totalCategories, totalItems, recentRatings, latestInventory,] = await Promise.all([
            // 1. Today's Scans (FIXED FILTER)
            prisma_1.prisma.qrScan.count({
                where: {
                    scannedAt: {
                        gte: start,
                        lte: end,
                    },
                },
            }),
            // 2. Out of Stock
            prisma_1.prisma.menuItem.count({ where: { isAvailable: false } }),
            // 3. Totals
            prisma_1.prisma.category.count(),
            prisma_1.prisma.menuItem.count(),
            // 4. Recent Ratings
            prisma_1.prisma.rating.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: { menuItem: { select: { name: true } } },
            }),
            // 5. Latest Inventory
            prisma_1.prisma.menuItem.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: { select: { name: true } },
                    images: { where: { isPrimary: true }, take: 1 },
                },
            }),
        ]);
        return {
            todayScans,
            outOfStock,
            totalCategories,
            totalItems,
            recentRatings,
            latestInventory,
        };
    },
    getPerformanceData: async () => {
        // Fetch all items with their individual rating values
        const items = await prisma_1.prisma.menuItem.findMany({
            include: {
                ratings: {
                    select: { ratingValue: true },
                },
                category: {
                    select: { name: true },
                },
            },
        });
        // Calculate Average Rating for each item
        const rankedItems = items.map((item) => {
            const total = item.ratings.reduce((sum, r) => sum + r.ratingValue, 0);
            const avg = item.ratings.length > 0 ? total / item.ratings.length : 0;
            return {
                id: item.id,
                name: item.name,
                category: item.category,
                avg: parseFloat(avg.toFixed(1)),
                count: item.ratings.length,
            };
        });
        // Sort by highest rating first for the Ranking Table
        const topRanking = [...rankedItems]
            .sort((a, b) => b.avg - a.avg)
            .slice(0, 5);
        // Calculate Global Scan-to-Feedback Conversion Rate
        const totalScans = await prisma_1.prisma.qrScan.count();
        const totalRatings = await prisma_1.prisma.rating.count();
        const completionRate = totalScans > 0 ? Math.round((totalRatings / totalScans) * 100) : 0;
        // Calculate Peak Scan Hour
        const allScans = await prisma_1.prisma.qrScan.findMany({
            select: { scannedAt: true },
        });
        const hourCounts = {};
        allScans.forEach((scan) => {
            const hr = new Date(scan.scannedAt).getHours();
            hourCounts[hr] = (hourCounts[hr] || 0) + 1;
        });
        const peakHour = Object.keys(hourCounts).length > 0
            ? Object.keys(hourCounts).reduce((a, b) => hourCounts[Number(a)] > hourCounts[Number(b)] ? a : b)
            : 12;
        const ampm = Number(peakHour) >= 12 ? 'PM' : 'AM';
        const displayHour = Number(peakHour) % 12 || 12;
        return {
            peakTime: `${displayHour}:00 ${ampm}`,
            completionRate,
            topDish: topRanking[0]?.name || 'N/A',
            ranking: topRanking,
        };
    },
};
