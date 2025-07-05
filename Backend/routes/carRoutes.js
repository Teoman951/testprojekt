import { Router } from 'express';
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';
import { createCar, getAllCars, getCarById, updateCar, deleteCar } from '../controllers/carController.js';

const router = Router();

// Fahrzeuge erstellen (nur Admins)
router.post('/', authMiddleware, authorizeRoles('admin'), createCar);

// Alle Fahrzeuge abrufen (jeder Authentifizierte)
//router.get('/', authMiddleware, getAllCars);
router.get('/', getAllCars);

// Einzelnes Fahrzeug abrufen (jeder Authentifizierte)
router.get('/:id', authMiddleware, getCarById);

// Fahrzeug aktualisieren (nur Admins)
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateCar);

// Fahrzeug löschen (nur Admins)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteCar);

export default router;