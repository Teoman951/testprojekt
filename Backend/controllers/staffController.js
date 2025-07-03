import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Car from '../models/Car.js';
import Rate from '../models/Rates.js';

class StaffController {
    // 1. Benutzerdaten aktualisieren
    async updateUser(req, res) {
        const userId = req.params.id;
        const { username, email, password } = req.body;

        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden' });

            if (username) user.username = username;
            if (email) user.email = email;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            await user.save();
            res.json({ message: 'Benutzerdaten aktualisiert', user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Fehler beim Aktualisieren' });
        }
    }

    // 2a. Alle Reservierungen eines Users einsehen
    async getReservationsByUser(req, res) {
        const userId = req.params.userId;

        try {
            const reservations = await Reservation.find({ user: userId });
            res.json(reservations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Fehler beim Abrufen der Reservierungen' });
        }
    }

    // 2b. Reservierung hinzufügen
    async addReservation(req, res) {
        const { user, car, startDate, endDate } = req.body;

        try {
            const newReservation = new Reservation({ user, car, startDate, endDate });
            await newReservation.save();
            res.status(201).json({ message: 'Reservierung hinzugefügt', reservation: newReservation });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Fehler beim Hinzufügen der Reservierung' });
        }
    }

    // 2c. Reservierung stornieren (löschen)
    async cancelReservation(req, res) {
        const reservationId = req.params.id;

        try {
            const reservation = await Reservation.findById(reservationId);
            if (!reservation) return res.status(404).json({ message: 'Reservierung nicht gefunden' });

            await reservation.deleteOne();
            res.json({ message: 'Reservierung storniert' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Fehler beim Stornieren der Reservierung' });
        }
    }

    // 3. Fahrzeugdaten ändern
    async updateCar(req, res) {
        const carId = req.params.id;
        const updates = req.body;

        try {
            const car = await Car.findById(carId);
            if (!car) return res.status(404).json({ message: 'Fahrzeug nicht gefunden' });

            Object.assign(car, updates);

            await car.save();
            res.json({ message: 'Fahrzeugdaten aktualisiert', car });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Fehler beim Aktualisieren des Fahrzeugs' });
        }
    }

    // 4a. Tarif hinzufügen
    async addRate(req, res) {
        const { name, price, duration } = req.body;

        try {
            const newRate = new Rate({ name, price, duration });
            await newRate.save();
            res.status(201).json({ message: 'Tarif hinzugefügt', rate: newRate });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Fehler beim Hinzufügen des Tarifs' });
        }
    }

    // 4b. Tarif löschen
    async deleteRate(req, res) {
        const rateId = req.params.id;

        try {
            const rate = await Rate.findById(rateId);
            if (!rate) return res.status(404).json({ message: 'Tarif nicht gefunden' });

            await rate.deleteOne();
            res.json({ message: 'Tarif gelöscht' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Fehler beim Löschen des Tarifs' });
        }
    }
}

export default new StaffController();
