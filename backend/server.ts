/**
 * Mystical Vacations Backend (Mock BFF - Backend for Frontend)
 * Express/TypeScript server with SGR/M-Pesa abstraction
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import packagesRouter from './routes/packages';
import accommodationRouter from './routes/accommodation';
import transportRouter from './routes/transport';
import excursionsRouter from './routes/excursions';
import bookingRouter from './routes/booking';
import paymentRouter from './routes/payment';
import sgrRouter from './routes/sgr';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/packages', packagesRouter);
app.use('/api/accommodation', accommodationRouter);
app.use('/api/transport', transportRouter);
app.use('/api/excursions', excursionsRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/sgr', sgrRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    },
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mystical Vacations Backend running on http://localhost:${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
});

