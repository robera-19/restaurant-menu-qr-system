import prisma from '../config/prisma';

export const RatingService = {

  create: async (data: any) => {
    return await prisma.rating.create({
      data: {
        menuItemId: data.menuItemId,
        ratingValue: data.ratingValue,
        customerName: data.customerName || 'Anonymous',
        comment: data.comment,
        qrCodeId: data.qrCodeId,
      },
    });
  },

  // 2. FOR ADMIN: Get full feedback list with names and comments
  getAdminFeedback: async () => {
    return await prisma.rating.findMany({
      include: {
        menuItem: { select: { name: true } },
        qrCode: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // 3. FOR ADMIN: Get specific stats for an item
  getItemFeedbackDetails: async (menuItemId: string) => {
    return await prisma.rating.findMany({
      where: { menuItemId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
