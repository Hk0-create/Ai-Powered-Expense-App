import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import transactionRoutes from './modules/transaction/transaction.routes.js';
import budgetRoutes from './modules/budget/budget.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development, specified CLIENT_URL, and any Vercel preview/deployment URLs
    const allowedOrigins = [
      'http://localhost:5173',
      process.env.CLIENT_URL,
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// For Vercel Serverless
export default app;

// Only listen if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
