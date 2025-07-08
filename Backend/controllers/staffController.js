// Backend/controllers/staffController.js
// Dieser Controller enthält Funktionen, die von Mitarbeitern (und Admins) ausgeführt werden können.

import User from '../models/User.js';
import Car from '../models/Car.js';
import Reservation from '../models/Reservation.js';
import Rate from '../models/Rates.js'; // Importiere das Rate-Modell
import { Op } from 'sequelize';
import bcrypt from "bcryptjs";

// Beispiel: Mitarbeiter kann Benutzerdaten aktualisieren (eingeschränkter als Admin)
export const updateUserDataByStaff = async (req, res) => {
    try {
        const { id } = req.params; // ID des zu aktualisierenden Benutzers
        const { username, email } = req.body; // Mitarbeiter dürfen nur bestimmte Felder ändern

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
        }

        // Mitarbeiter dürfen nur username und email ändern, NICHT Rolle oder Tarif
        user.username = username !== undefined ? username : user.username;
        user.email = email !== undefined ? email : user.email;

        await user.save();
        res.json({ message: 'Benutzerdaten erfolgreich aktualisiert (durch Mitarbeiter).', user });
    } catch (error) {
        console.error('updateUserDataByStaff error:', error);
        res.status(500).json({ message: 'Serverfehler beim Aktualisieren der Benutzerdaten.' });
    }
};

// Beispiel: Mitarbeiter kann Reservierungen eines bestimmten Benutzers abrufen
export const getReservationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const reservations = await Reservation.findAll({
            where: { userId: userId },
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: Car, attributes: ['id', 'brand', 'model', 'licensePlate'] }
            ]
        });
        res.json(reservations);
    } catch (error) {
        console.error('getReservationsByUser error:', error);
        res.status(500).json({ message: 'Serverfehler beim Abrufen der Reservierungen.' });
    }
};

// Beispiel: Mitarbeiter kann den Status einer Reservierung ändern
export const updateReservationStatusByStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservierung nicht gefunden.' });
        }

        // Mitarbeiter dürfen den Status ändern
        if (status !== undefined) {
            reservation.status = status;
        }

        await reservation.save();
        res.json({ message: 'Reservierungsstatus erfolgreich aktualisiert (durch Mitarbeiter).', reservation });
    } catch (error) {
        console.error('updateReservationStatusByStaff error:', error);
        res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Reservierungsstatus.' });
    }
};

// Beispiel: Mitarbeiter kann Fahrzeugdaten aktualisieren
export const updateCarByStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { licensePlate, brand, model, year, color, location, dailyRate, isAvailable } = req.body;

        const car = await Car.findByPk(id);
        if (!car) {
            return res.status(404).json({ message: 'Fahrzeug nicht gefunden.' });
        }

        car.licensePlate = licensePlate !== undefined ? licensePlate : car.licensePlate;
        car.brand = brand !== undefined ? brand : car.brand;
        car.model = model !== undefined ? model : car.model;
        car.year = year !== undefined ? year : car.year;
        car.color = color !== undefined ? color : car.color;
        car.location = location !== undefined ? location : car.location;
        car.dailyRate = dailyRate !== undefined ? dailyRate : car.dailyRate;
        car.isAvailable = isAvailable !== undefined ? isAvailable : car.isAvailable;

        await car.save();
        res.json({ message: 'Fahrzeugdaten erfolgreich aktualisiert (durch Mitarbeiter).', car });
    } catch (error) {
        console.error('updateCarByStaff error:', error);
        res.status(500).json({ message: 'Serverfehler beim Aktualisieren der Fahrzeugdaten.' });
    }
};

// Beispiel: Mitarbeiter kann Tarife erstellen (wie Admin)
export const createRateByStaff = async (req, res) => {
    // Diese Funktion kann die createRate-Funktion aus rateController aufrufen oder Logik duplizieren.
    // Für Einfachheit rufen wir sie hier direkt auf oder duplizieren die Logik.
    // Besser wäre es, wenn rateController.createRate die Berechtigungsprüfung selbst macht
    // oder authorizeRoles in der Route verwendet wird.
    // Da hier authorizeRoles('mitarbeiter', 'admin') in der Route angewendet wird,
    // können wir die Logik direkt hier implementieren.
    try {
        const { name, pricePerHour, description } = req.body;

        if (!name || pricePerHour === undefined || pricePerHour === null) {
            return res.status(400).json({ message: 'Name und Preis pro Stunde sind erforderlich.' });
        }
        if (isNaN(parseFloat(pricePerHour))) {
            return res.status(400).json({ message: 'Preis pro Stunde muss eine gültige Zahl sein.' });
        }

        const newRate = await Rate.create({
            name,
            pricePerHour: parseFloat(pricePerHour),
            description,
        });

        res.status(201).json({ message: 'Tarif erfolgreich erstellt (durch Mitarbeiter).', rate: newRate });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Ein Tarif mit diesem Namen existiert bereits.' });
        }
        console.error('createRateByStaff error:', error);
        res.status(500).json({ message: 'Serverfehler beim Erstellen des Tarifs.' });
    }
};

// Beispiel: Mitarbeiter kann Tarife löschen (wie Admin)
export const deleteRateByStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const rate = await Rate.findByPk(id);
        if (!rate) {
            return res.status(404).json({ message: 'Tarif nicht gefunden.' });
        }
        await rate.destroy();
        res.json({ message: 'Tarif erfolgreich gelöscht (durch Mitarbeiter).' });
    } catch (error) {
        console.error('deleteRateByStaff error:', error);
        res.status(500).json({ message: 'Serverfehler beim Löschen des Tarifs.' });
    }
}