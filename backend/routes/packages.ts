import { Router, Request, Response } from 'express';
import { packages } from '../../data/packages';
import type { IAPIResponse, IPackage } from '../../types';

const router = Router();

/**
 * GET /api/packages
 * Get all packages with optional filters
 */
router.get('/', (req: Request, res: Response) => {
  const { featured, country, minDuration, maxDuration } = req.query;

  let filtered = [...packages];

  if (featured === 'true') {
    filtered = filtered.filter((pkg) => pkg.featured);
  }

  if (country) {
    filtered = filtered.filter((pkg) =>
      pkg.locations.some((loc) => loc.country === country)
    );
  }

  if (minDuration) {
    filtered = filtered.filter((pkg) => pkg.duration >= parseInt(minDuration as string));
  }

  if (maxDuration) {
    filtered = filtered.filter((pkg) => pkg.duration <= parseInt(maxDuration as string));
  }

  const response: IAPIResponse<IPackage[]> = {
    success: true,
    data: filtered,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * GET /api/packages/:id
 * Get a specific package by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  const pkg = packages.find((p) => p.id === req.params.id);

  if (!pkg) {
    const response: IAPIResponse<never> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Package not found',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(404).json(response);
  }

  const response: IAPIResponse<IPackage> = {
    success: true,
    data: pkg,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

export default router;

