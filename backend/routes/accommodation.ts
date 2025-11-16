import { Router, Request, Response } from 'express';
import { accommodations } from '../../data/accommodation';
import type { IAPIResponse, IAccommodation } from '../../types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { country, type, minPrice, maxPrice } = req.query;

  let filtered = [...accommodations];

  if (country) {
    filtered = filtered.filter((acc) => acc.location.country === country);
  }

  if (type) {
    filtered = filtered.filter((acc) => acc.type === type);
  }

  if (minPrice) {
    filtered = filtered.filter((acc) => acc.pricePerNight >= parseInt(minPrice as string));
  }

  if (maxPrice) {
    filtered = filtered.filter((acc) => acc.pricePerNight <= parseInt(maxPrice as string));
  }

  const response: IAPIResponse<IAccommodation[]> = {
    success: true,
    data: filtered,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

export default router;

