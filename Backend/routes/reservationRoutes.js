import { Router } from 'express';
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';
import { createReservation, getReservations, getReservationById, updateReservation, deleteReservation } from '../controllers/reservationController.js';

const router = Router();

// Reservierung erstellen (jeder Authentifizierte)
router.post('/', authMiddleware, createReservation);

// Alle Reservierungen abrufen (Admin) oder eigene (Nutzer)
router.get('/', authMiddleware, getReservations);

// Eine spezifische Reservierung abrufen (Admin oder Besitzer)
router.get('/:id', authMiddleware, getReservationById);

// Reservierung aktualisieren (Admin oder Besitzer)
router.put('/:id', authMiddleware, updateReservation);

// Reservierung löschen (Admin oder Besitzer)
router.delete('/:id', authMiddleware, deleteReservation);

export default router;