// Backend/controllers/userController.js
import User from '../models/User.js'; // User-Modell importieren

// Aktuellen eingeloggten Benutzer abrufen (z.B. für /me)
export const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'role'], // Felder, die zurückgegeben werden
        });
        if (!user) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Fehler bei getMe:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
};

// Alle Benutzer abrufen (Admin-Funktion)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role'], // gewünschte Felder
        });
        res.json(users);
    } catch (error) {
        console.error('Fehler beim Laden der Benutzer:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
};

// Benutzer aktualisieren
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;

    try {
        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
        }

        // Berechtigungsprüfung
        if (req.user.role !== 'admin') {
            if (req.user.id !== userToUpdate.id) {
                return res.status(403).json({ message: 'Nicht berechtigt, diesen Benutzer zu bearbeiten.' });
            }
            if (userToUpdate.role === 'admin') {
                return res.status(403).json({ message: 'Sie dürfen keinen Administrator bearbeiten.' });
            }
        }

        // Felder aktualisieren
        userToUpdate.username = username || userToUpdate.username;
        userToUpdate.email = email || userToUpdate.email;
        if (req.user.role === 'admin' && role) {
            userToUpdate.role = role;
        }

        await userToUpdate.save();

        res.status(200).json({
            message: 'Benutzer erfolgreich aktualisiert.',
            user: {
                id: userToUpdate.id,
                username: userToUpdate.username,
                email: userToUpdate.email,
                role: userToUpdate.role,
            },
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
        res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Benutzers' });
    }
};

// Benutzer löschen
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const userToDelete = await User.findByPk(id);
        if (!userToDelete) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
        }

        // Berechtigungsprüfung
        if (req.user.role !== 'admin') {
            if (req.user.id !== userToDelete.id) {
                return res.status(403).json({ message: 'Nicht berechtigt, diesen Benutzer zu löschen.' });
            }
            if (userToDelete.role === 'admin') {
                return res.status(403).json({ message: 'Sie dürfen keinen Administrator löschen.' });
            }
        }

        await userToDelete.destroy();
        res.json({ message: 'Benutzer erfolgreich gelöscht.' });
    } catch (error) {
        console.error('Fehler beim Löschen des Benutzers:', error);
        res.status(500).json({ message: 'Serverfehler beim Löschen des Benutzers' });
    }
};
