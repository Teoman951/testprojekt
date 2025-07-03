import { Router } from 'express';
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';
import { getMe, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';


const router = Router();

// Geschützte Route: Aktuellen Benutzer abrufen
router.get('/me', authMiddleware, getMe);

// Geschützte Route: Alle Benutzer abrufen (nur Admins)
router.get('/', authMiddleware, authorizeRoles('admin','mitarbeiter'), getAllUsers);

// Geschützte Route: Benutzer aktualisieren (eigener Nutzer oder Admin)
router.put('/:id', authMiddleware, updateUser); // Rollenprüfung im Controller

// Geschützte Route: Benutzer löschen (eigener Nutzer oder Admin)
router.delete('/:id', authMiddleware, deleteUser); // Rollenprüfung im Controller


export default router;