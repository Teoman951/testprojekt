import User from '../models/User.js';

// Aktuellen Benutzer abrufen
export const getMe = async (req, res) => {
    try {
        // req.user.id kommt vom authMiddleware nach erfolgreicher Token-Verifizierung
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Passwort nicht zurückgeben
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

// Alle Benutzer abrufen (nur für Admins)
export const getAllUsers = async (req, res) => {
    try {
        // Hier wäre eine Rollenprüfung für Admin erforderlich, wenn nicht bereits in der Route geschehen
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error.message);
        res.status(500).send('Server error');
    }
};

// Benutzer aktualisieren
export const updateUser = async (req, res) => {
    const { id } = req.params; // ID des zu aktualisierenden Benutzers
    const { username, email, role } = req.body; // Erlaubte Felder

    try {
        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Rollenprüfung: Nur Admin darf Rollen ändern, oder Benutzer sich selbst (außer Rolle)
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }
        if (req.user.role !== 'admin' && role && user.role !== role) {
            return res.status(403).json({ message: 'Not authorized to change user role' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        if (req.user.role === 'admin' && role) { // Nur Admin darf Rolle ändern
            user.role = role;
        }

        await user.save();
        // Passwort niemals hier aktualisieren, dafür einen separaten Endpunkt nutzen
        res.json({ message: 'User updated successfully', user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Update user error:', error.message);
        res.status(500).send('Server error');
    }
};

// Benutzer löschen
export const deleteUser = async (req, res) => {
    const { id } = req.params; // ID des zu löschenden Benutzers

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Rollenprüfung: Nur Admin darf Benutzer löschen, oder Benutzer sich selbst
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Not authorized to delete this user' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error.message);
        res.status(500).send('Server error');
    }
};