import { Router } from 'express';
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';
// Korrigierte Importe für die Controller-Funktionen
import { deleteUser } from '../controllers/userController.js';
import { createCar, updateCar } from '../controllers/carController.js';
import { deleteReservation } from '../controllers/reservationController.js';
import { registerStaff } from '../controllers/authController.js';

const router = Router();

// Mitarbeiter erstellen (nur Admin)
router.post('/staff/register', authMiddleware, authorizeRoles('admin'), registerStaff);

router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), deleteUser);
router.post('/car', authMiddleware, authorizeRoles('admin'), createCar);
router.put('/car/:id', authMiddleware, authorizeRoles('admin'), updateCar);
router.delete('/reservations/:id', authMiddleware, authorizeRoles('admin'), deleteReservation);

export default router;