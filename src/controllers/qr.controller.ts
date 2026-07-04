import { Request, Response, NextFunction } from 'express';
import { QrService } from '../services/qr.service';

// ADMIN: Create a new QR code
export const createQr = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = (req as any).user.id;
    const qr = await QrService.create(req.body.name, adminId);
    res.status(201).json(qr);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get the image to print
export const getQrImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const image = await QrService.generateImage(req.params.shortId);
    res.json({ image });
  } catch (error) {
    next(error);
  }
};

// ADMIN: List all QR codes with scan totals
export const listQrs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const qrs = await QrService.getAll();
    res.json(qrs);
  } catch (error) {
    next(error);
  }
};

// PUBLIC: THE REDIRECTOR (This handles the actual scan)
export const handleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shortId } = req.params;
    const qr = await QrService.getByShortId(shortId);

    if (!qr) return res.status(404).send('Invalid QR Code');

    // Background: Log the scan (no await to keep redirect fast)
    QrService.logScan(qr.id);

    // Redirect to your frontend URL
    const frontendUrl = `https://restaurant-menu-qr-customer.vercel.app/menu/qr/${shortId}`;
    res.redirect(frontendUrl);
  } catch (error) {
    next(error);
  }
};
