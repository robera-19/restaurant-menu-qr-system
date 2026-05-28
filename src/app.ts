import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Routes
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import menuRoutes from './routes/menu.routes';
import qrRoutes from './routes/qr.routes';
import ratingRoutes from './routes/rating.routes';
import customerMenuRoutes from './routes/customerMenu';
import analyticsRoutes from './routes/analytics.routes';
// Middleware
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    message: 'Server is healthy',
  });
});

// ==========================================
// 3. CORE API ROUTES (VERSIONED)
// ==========================================

// AUTH
app.use('/api/v1/auth', authRoutes);

// ADMIN MENU
app.use('/api/v1/menu', menuRoutes);

// CATEGORIES
app.use('/api/v1/categories', categoryRoutes);

// QR MANAGEMENT (ADMIN)
app.use('/api/v1/qr', qrRoutes);

// RATINGS
app.use('/api/v1/ratings', ratingRoutes);

// ANALYTICS
app.use('/api/v1/analytics', analyticsRoutes);

// CUSTOMER MENU (QR BASED ACCESS)
app.use('/api/menu', customerMenuRoutes);

// ==========================================
// 4. 404 HANDLER
// ==========================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
