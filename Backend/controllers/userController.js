import User from '../models/User.js'; // Import des User-Modells
import bcrypt from 'bcryptjs'; // Importiert bcryptjs für Passwort-Hashing (relevant für zukünftige Passwort-Änderungen, hier nicht direkt verwendet)

// Controller-Funktion zum Abrufen des eigenen Benutzerprofils
export const getMe = async (req, res) => {
    try {
        // req.user.id kommt vom authMiddleware nach erfolgreicher Token-Verifizierung
        // Ruft den Benutzer anhand seiner ID ab und schließt das Passwort aus
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            // Wenn Benutzer nicht gefunden wurde (obwohl ein Token vorhanden ist), ist dies ein Fehler
            return res.status(404).json({ message: 'User not found' });
        }
        // Sende die Benutzerdaten zurück
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error.message);
        res.status(500).send('Server error');
    }
};

// Controller-Funktion zum Abrufen aller Benutzer (Admin-Berechtigung erforderlich)
export const getAllUsers = async (req, res) => {
    try {
        // Ruft alle Benutzer ab und schließt Passwörter aus
        // Die Rollenprüfung für Admin erfolgt bereits in der Route (userRoutes.js)
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error.message);
        res.status(500).send('Server error');
    }
};

// Controller-Funktion zum Aktualisieren eines Benutzers
export const updateUser = async (req, res) => {
    const { id } = req.params; // Die ID des zu aktualisierenden Benutzers kommt aus der URL
    const { username, email, role } = req.body; // Daten, die vom Frontend gesendet werden

    try {
        // Suche den Benutzer in der Datenbank
        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Rollenprüfung: Wer darf wen aktualisieren?
        // 1. Ein normaler Benutzer (req.user.role !== 'admin') darf nur sein eigenes Profil aktualisieren.
        //    `req.user.id` ist die ID des eingeloggten Benutzers (aus dem JWT).
        //    `parseInt(id)` ist die ID des Benutzers, der aktualisiert werden soll (aus der URL).
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }
        // 2. Ein normaler Benutzer darf seine eigene Rolle NICHT ändern.
        //    Wenn eine 'role' im Body gesendet wird UND der eingeloggte Benutzer KEIN Admin ist UND die gesendete Rolle anders ist als die aktuelle, blockieren.
        if (req.user.role !== 'admin' && role && user.role !== role) {
            return res.status(403).json({ message: 'Not authorized to change user role' });
        }

        // Aktualisiere die Felder des Benutzers
        // Nutzt den gesendeten Wert, falls vorhanden, sonst behält es den alten Wert
        user.username = username || user.username;
        user.email = email || user.email;

        // Die Rolle kann nur von einem Admin geändert werden (bereits oben geprüft)
        if (req.user.role === 'admin' && role) {
            user.role = role;
        }

        await user.save(); // Speichert die Änderungen in der Datenbank

        // Sende den aktualisierten Benutzer zurück (ohne Passwort für Sicherheit)
        res.json({ message: 'User updated successfully', user: { id: user.id, username: user.username, email: user.email, role: user.role } });

    } catch (error) {
        console.error('Update user error:', error.message);
        res.status(500).send('Server error');
    }
};

// Controller-Funktion zum Löschen eines Benutzers
export const deleteUser = async (req, res) => {
    const { id } = req.params; // ID des zu löschenden Benutzers kommt aus der URL

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Rollenprüfung: Nur Admin oder der Benutzer selbst darf sich löschen
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Not authorized to delete this user' });
        }

        await user.destroy(); // Löscht den Benutzer aus der Datenbank
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error.message);
        res.status(500).send('Server error');
    }
};
