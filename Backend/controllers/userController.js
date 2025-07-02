import { Car, User, Rate } from '../config/database.js';
import bcrypt from 'bcryptjs';

// GET /api/users/me - Den eingeloggten Benutzer abrufen
export const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: {
                model: Rate,
                as: 'AssignedRate'
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error.message);
        res.status(500).send('Server error');
    }
};

// POST /api/users/assign-rate - Einem Benutzer einen Tarif zuweisen
export const assignRateToUser = async (req, res) => {
    const { rateId } = req.body;
    const userId = req.user.id;

    try {
        const rate = await Rate.findByPk(rateId);
        if (!rate) {
            return res.status(404).json({ message: 'Rate not found' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.rateId = rateId;
        await user.save();

        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: { model: Rate, as: 'AssignedRate' }
        });

        res.json({ message: 'Rate updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Assign rate to user error:', error.message);
        res.status(500).send('Server error');
    }
};

// GET /api/users - Alle Benutzer abrufen (typischerweise eine Admin-Funktion)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error.message);
        res.status(500).send('Server error');
    }
};

// PUT /api/users/:id - Einen Benutzer aktualisieren
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email } = req.body;
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        const userResponse = user.toJSON();
        delete userResponse.password;

        res.json({ message: 'User updated successfully', user: userResponse });
    } catch (error) {
        console.error('Update user error:', error.message);
        res.status(500).send('Server error');
    }
};

// DELETE /api/users/:id - Einen Benutzer löschen
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error('Delete user error:', error.message);
        res.status(500).send('Server error');
    }
};