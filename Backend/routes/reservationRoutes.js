import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; // authMiddleware ist ein Standard-Export
import { authorizeRoles } from '../middleware/authMiddleware.js'; // KORREKTUR: authorizeRoles aus derselben Middleware-Datei

import {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation
} from '../controllers/reservationController.js';

const router = Router();

// Reservierung erstellen (jeder Authentifizierte)
router.post('/', authMiddleware, createReservation);

// Alle Reservierungen abrufen (Admin) oder eigene (Nutzer)
// Admins sehen alle, normale Nutzer nur ihre eigenen (Logik im Controller)
router.get('/', authMiddleware, getReservations);

// Eine spezifische Reservierung abrufen (Admin oder Besitzer)
router.get('/:id', authMiddleware, getReservationById);

// Reservierung aktualisieren (Admin oder Besitzer)
// KORREKTUR: authorizeRoles für Admin-Zugriff auf andere Reservierungen
router.put('/:id', authMiddleware, updateReservation);

// Reservierung löschen (Admin oder Besitzer)
// KORREKTUR: authorizeRoles für Admin-Zugriff auf andere Reservierungen
router.delete('/:id', authMiddleware, deleteReservation);

export default router;
