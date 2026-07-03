import { prisma } from '../config/prisma';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { env } from '../config/env';

export const QrService = {
  // 1. Create a new QR entry in DB
  create: async (name: string, adminId: string) => {
    return await prisma.qrCode.create({
      data: {
        name,
        createdBy: adminId,
        shortId: nanoid(6), // Generates a unique 6-char ID like "aB9x2p"
      },
    });
  },

  // 2. Find QR by shortId for the redirector
  getByShortId: (shortId: string) =>
    prisma.qrCode.findUnique({ where: { shortId } }),

  // 3. Log the scan for Analytics
  logScan: async (qrCodeId: string) => {
    return await prisma.qrScan.create({
      data: { qrCodeId },
    });
  },

  // 4. Generate the actual printable QR image
  generateImage: async (shortId: string) => {
    const backendUrl = `https://restaurant-menu-qr-system-production.up.railway.app/q/${shortId}`;
    // Returns a Base64 Data URL that you can put in an <img src="...">
    return await QRCode.toDataURL(backendUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  },

  // 5. Get all QRs for the Admin list
  getAll: () =>
    prisma.qrCode.findMany({
      include: { _count: { select: { scans: true } } },
      orderBy: { createdAt: 'desc' },
    }),
};
