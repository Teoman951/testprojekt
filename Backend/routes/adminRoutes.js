import { Router } from 'express';
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';
import {
    deleteUser,
    createCar,
    updateCar,
    deleteReservation,
} from '../controllers/adminController.js';

const router = Router();

router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), deleteUser);
router.post('/car', authMiddleware, authorizeRoles('admin'), createCar);
router.put('/car/:id', authMiddleware, authorizeRoles('admin'), updateCar);
router.delete('/reservations/:id', authMiddleware, authorizeRoles('admin'), deleteReservation);

export default router;