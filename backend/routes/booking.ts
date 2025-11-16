import { Router, Request, Response } from 'express';
import type { IAPIResponse, IBooking } from '../../types';

const router = Router();

// In-memory store for demo (would be database in production)
const bookings: IBooking[] = [];

/**
 * POST /api/booking/create
 * Create a new booking
 */
router.post('/create', (req: Request, res: Response) => {
  const bookingData = req.body;

  const booking: IBooking = {
    id: `booking-${Date.now()}`,
    bookingReference: bookingData.bookingReference,
    items: bookingData.items,
    guestDetails: bookingData.guestDetails,
    priceBreakdown: bookingData.priceBreakdown,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentStatus: 'pending',
  };

  bookings.push(booking);

  const response: IAPIResponse<IBooking> = {
    success: true,
    data: booking,
    timestamp: new Date().toISOString(),
  };

  res.status(201).json(response);
});

/**
 * GET /api/booking/:reference
 * Get booking by reference
 */
router.get('/:reference', (req: Request, res: Response) => {
  const booking = bookings.find((b) => b.bookingReference === req.params.reference);

  if (!booking) {
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Booking not found',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(404).json(response);
  }

  const response: IAPIResponse<IBooking> = {
    success: true,
    data: booking,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

export default router;

