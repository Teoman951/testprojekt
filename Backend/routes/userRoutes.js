import { Router } from 'express';
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';
import {
    getMe,
    getAllUsers,
    updateUser,
    deleteUser,
    assignRateToUser // Die neue Funktion importieren
} from '../controllers/userController.js';

const router = Router();

// Ruft das Profil des eingeloggten Benutzers ab (inkl. Tarif)
router.get('/me', authMiddleware, getMe);

// NEU: Aktualisiert den Tarif des eingeloggten Benutzers
router.put('/me/rate', authMiddleware, assignRateToUser);

// --- Admin-Routen ---
// Ruft alle Benutzer ab (nur für Admins)
router.get('/', authMiddleware, authorizeRoles('admin'), getAllUsers);

// Aktualisiert einen beliebigen Benutzer (nur für Admins oder den Benutzer selbst)
router.put('/:id', authMiddleware, updateUser);

// Löscht einen Benutzer (nur für Admins oder den Benutzer selbst)
router.delete('/:id', authMiddleware, deleteUser);

export default router;