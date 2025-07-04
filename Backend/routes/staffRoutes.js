// Backend/routes/staffRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authMiddleware.js'; // Kombinierte Middleware

// Importiere Funktionen aus dem staffController
import {
    updateUserDataByStaff,
    getReservationsByUser,
    updateReservationStatusByStaff,
    updateCarByStaff,
    createRateByStaff,
    deleteRateByStaff
} from '../controllers/staffController.js';

const router = express.Router();

// Alle Routen in diesem Router erfordern Authentifizierung und die Rolle 'mitarbeiter' oder 'admin'
router.use(authMiddleware);
router.use(authorizeRoles('mitarbeiter', 'admin'));

// Routen für Mitarbeiter-Verwaltung
// Benutzerdaten aktualisieren (eingeschränkt, nur username/email)
router.put('/users/:id', updateUserDataByStaff);

// Reservierungen verwalten
router.get('/reservations/user/:userId', getReservationsByUser);
router.put('/reservations/:id/status', updateReservationStatusByStaff); // Spezifische Route für Status-Update

// Fahrzeugdaten aktualisieren
router.put('/cars/:id', updateCarByStaff);

// Tarife verwalten (Mitarbeiter dürfen erstellen und löschen)
router.post('/rates', createRateByStaff);
router.delete('/rates/:id', deleteRateByStaff);

export default router;
