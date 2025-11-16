import { Router, Request, Response } from 'express';
import { excursions } from '../../data/excursions';
import type { IAPIResponse, IExcursion } from '../../types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { category, location, minPrice, maxPrice } = req.query;

  let filtered = [...excursions];

  if (category && category !== 'all') {
    filtered = filtered.filter((exc) => exc.category === category);
  }

  if (location) {
    filtered = filtered.filter((exc) =>
      exc.location.city.toLowerCase().includes((location as string).toLowerCase())
    );
  }

  if (minPrice) {
    filtered = filtered.filter((exc) => exc.price >= parseInt(minPrice as string));
  }

  if (maxPrice) {
    filtered = filtered.filter((exc) => exc.price <= parseInt(maxPrice as string));
  }

  const response: IAPIResponse<IExcursion[]> = {
    success: true,
    data: filtered,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

export default router;

