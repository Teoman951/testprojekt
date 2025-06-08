import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Registrierung
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Prüfen, ob Benutzer bereits existiert
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Passwort hashen
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Neuen Benutzer erstellen
        user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user' // Standardrolle
        });

        // JWT erstellen
        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token läuft in 1 Stunde ab
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ message: 'User registered successfully', token });
            }
        );
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).send('Server error');
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Prüfen, ob Benutzer existiert
        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Passwort vergleichen
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // JWT erstellen
        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ message: 'Logged in successfully', token });
            }
        );
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).send('Server error');
    }
};