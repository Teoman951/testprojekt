// routes/rateRoutes.js
import express from 'express';
import {
    createRate,
    getAllRates,
    getRateById,
    updateRate,
    deleteRate
} from '../controllers/ratesController.js'; // Pfad anpassen

const router = express.Router();

router.post('/', createRate);
router.get('/', getAllRates);
router.get('/:id', getRateById);
router.put('/:id', updateRate);
router.delete('/:id', deleteRate);

export default router;