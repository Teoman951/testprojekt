// controllers/rateController.js
import Rates from '../models/Rates.js'; // Stelle sicher, dass dies dein Sequelize-Modell ist!

// Neue Rates erstellen (z.B. nur Admin erlaubt)
export const createRate = async (req, res) => {
    try {
        const { name, pricePerHour, description } = req.body;

        if (!name || pricePerHour === undefined || pricePerHour === null) {
            return res.status(400).json({ message: 'Name und Preis pro Stunde sind erforderlich.' });
        }

        // Überprüfe, ob der Preis eine gültige Zahl ist
        if (isNaN(parseFloat(pricePerHour))) {
            return res.status(400).json({ message: 'Preis pro Stunde muss eine gültige Zahl sein.' });
        }

        const newRate = await Rates.create({
            name,
            pricePerHour: parseFloat(pricePerHour), // Stelle sicher, dass es eine Zahl ist
            description,
        });

        res.status(201).json({ message: 'Tarif erfolgreich erstellt.', rate: newRate });
    } catch (error) {
        // Überprüfen auf spezifische Sequelize-Fehler, z.B. Unique Constraint
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Ein Tarif mit diesem Namen existiert bereits.' });
        }
        console.error('createRate error:', error);
        res.status(500).json({ message: 'Serverfehler beim Erstellen des Tarifs.' });
    }
};

// Alle Tarife abrufen
export const getAllRates = async (req, res) => {
    try {
        // findAll ist die korrekte Methode in Sequelize
        const rates = await Rates.findAll();
        res.json(rates);
    } catch (error) {
        console.error('getAllRates error:', error);
        res.status(500).json({ message: 'Serverfehler beim Abrufen der Tarife.' });
    }
};

// Einzelnen Tarif abrufen
export const getRateById = async (req, res) => {
    try {
        const rate = await Rates.findByPk(req.params.id); // findByPk ist korrekt
        if (!rate) {
            return res.status(404).json({ message: 'Tarif nicht gefunden.' });
        }
        res.json(rate);
    } catch (error) {
        console.error('getRateById error:', error);
        res.status(500).json({ message: 'Serverfehler beim Abrufen des Tarifs.' });
    }
};

// Tarif aktualisieren (z.B. Admin)
export const updateRate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, pricePerHour, description } = req.body;

        const rate = await Rates.findByPk(id);
        if (!rate) {
            return res.status(404).json({ message: 'Tarif nicht gefunden.' });
        }

        // Aktualisiere nur die übergebenen Felder
        rate.name = name !== undefined ? name : rate.name;
        rate.description = description !== undefined ? description : rate.description;

        // Prüfe pricePerHour separat, da 0 ein gültiger Wert sein könnte
        if (pricePerHour !== undefined && pricePerHour !== null) {
            if (isNaN(parseFloat(pricePerHour))) {
                return res.status(400).json({ message: 'Preis pro Stunde muss eine gültige Zahl sein.' });
            }
            rate.pricePerHour = parseFloat(pricePerHour);
        }

        await rate.save(); // Speichert die Änderungen

        res.json({ message: 'Tarif erfolgreich aktualisiert.', rate });
    } catch (error) {
        // Erneut auf Unique Constraint Error prüfen, falls 'name' geändert wurde
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Ein Tarif mit diesem Namen existiert bereits.' });
        }
        console.error('updateRate error:', error);
        res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Tarifs.' });
    }
};

// Tarif löschen (z.B. Admin)
export const deleteRate = async (req, res) => {
    try {
        const { id } = req.params;
        const rate = await Rates.findByPk(id); // findByPk ist korrekt
        if (!rate) {
            return res.status(404).json({ message: 'Tarif nicht gefunden.' });
        }

        await rate.destroy(); // destroy ist korrekt
        res.json({ message: 'Tarif erfolgreich gelöscht.' });
    } catch (error) {
        console.error('deleteRate error:', error);
        res.status(500).json({ message: 'Serverfehler beim Löschen des Tarifs.' });
    }
};