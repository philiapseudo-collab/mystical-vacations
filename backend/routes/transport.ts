import { Router, Request, Response } from 'express';
import { transportRoutes } from '../../data/transport';
import type { IAPIResponse, ITransportSearchResponse } from '../../types';

const router = Router();

/**
 * GET /api/transport/search
 * Search for transport routes
 */
router.get('/search', (req: Request, res: Response) => {
  const { origin, destination, mode } = req.query;

  let filtered = [...transportRoutes];

  if (origin && destination) {
    filtered = filtered.filter((route) => {
      const firstSeg = route.segments[0];
      const lastSeg = route.segments[route.segments.length - 1];
      return (
        firstSeg.departureLocation.city.toLowerCase().includes((origin as string).toLowerCase()) &&
        lastSeg.arrivalLocation.city.toLowerCase().includes((destination as string).toLowerCase())
      );
    });
  }

  if (mode) {
    filtered = filtered.filter((route) =>
      route.segments.some((seg) => seg.mode === mode)
    );
  }

  const searchResponse: ITransportSearchResponse = {
    routes: filtered,
    searchId: `search-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  const response: IAPIResponse<ITransportSearchResponse> = {
    success: true,
    data: searchResponse,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

export default router;

