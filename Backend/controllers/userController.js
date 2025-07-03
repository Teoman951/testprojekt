import User from '../models/User.js'; // je nach deiner Struktur

export const createUser = async (req, res) => {
    const { username, email, password, role,dateOfBirth } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Bitte alle Pflichtfelder ausfüllen.' });
    }

    try {
        // Check, ob Nutzer schon existiert
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Benutzer mit dieser E-Mail existiert bereits.' });
        }

        // Passwort hashen (bcrypt)
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Benutzer anlegen mit Rolle aus Body (nur Admin kann Rolle angeben!)
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user' // Default 'user' falls keine Rolle angegeben
        });

        res.status(201).json({
            message: 'Benutzer erfolgreich erstellt',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Fehler beim Erstellen des Benutzers:', error);
        res.status(500).json({ message: 'Serverfehler beim Erstellen des Benutzers' });
    }
};
