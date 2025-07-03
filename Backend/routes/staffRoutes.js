// routes/staffRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET /api/staff wurde aufgerufen');
    res.json({ message: 'Staff route funktioniert!' });
});

router.post('/', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    console.log('POST /api/staff wurde aufgerufen');
    try {
        const { username, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'mitarbeiter',
        });

        res.status(201).json({
            message: 'Mitarbeiter erfolgreich erstellt',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            }
        });
    } catch (error) {
        console.error('Fehler in POST /api/staff:', error);
        res.status(500).json({ message: 'Serverfehler beim Erstellen des Mitarbeiters' });
    }
});

export default router;
