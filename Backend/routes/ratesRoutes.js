// routes/rateRoutes.js
import { Router } from 'express';
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';

import {
    createRate,
    getAllRates,
    getRateById,
    updateRate,
    deleteRate
} from '../controllers/ratesController.js'; // Pfad anpassen

const router = Router();

router.post('/', createRate);
router.get('/', getAllRates);
router.get('/:id', getRateById);
router.put('/:id', updateRate);
router.delete('/:id', deleteRate);

export default router;