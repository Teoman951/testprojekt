// Backend/controllers/reservationController.js
import Reservation from '../models/Reservation.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

// Neue Reservierung erstellen
export const createReservation = async (req, res) => {
    const { carId, startTime, endTime } = req.body;
    const userId = req.user.id; // Kommt vom JWT

    try {
        // Prüfen, ob Auto existiert
        const car = await Car.findByPk(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Prüfen, ob Auto für den Zeitraum verfügbar ist
        const existingReservations = await Reservation.findAll({
            where: {
                carId: carId,
                [Op.or]: [
                    { // Bestehende Reservierung überlappt den neuen Startzeitpunkt
                        startTime: { [Op.lt]: new Date(endTime) },
                        endTime: { [Op.gt]: new Date(startTime) }
                    }
                ]
            }
        });

        if (existingReservations.length > 0) {
            return res.status(400).json({ message: 'Car is not available for the selected time slot.' });
        }

        // Optional: Kosten berechnen (sehr vereinfacht)
        const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        const totalCost = car.dailyRate * (durationHours / 24); // Angenommen dailyRate ist pro Tag

        const newReservation = await Reservation.create({
            userId,
            carId,
            startTime,
            endTime,
            totalCost: parseFloat(totalCost.toFixed(2)),
            status: 'pending' // Oder 'confirmed', je nach Logik
        });

        res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
    } catch (error) {
        console.error('Create reservation error:', error.message);
        res.status(500).send('Server error');
    }
};

// Alle Reservierungen abrufen (Admin oder eigene des Users)
export const getReservations = async (req, res) => {
    try {
        let whereClause = {};
        // Wenn es kein Admin ist, nur eigene Reservierungen abrufen
        if (req.user.role !== 'admin') {
            whereClause.userId = req.user.id;
        }

        const reservations = await Reservation.findAll({
            where: whereClause,
            include: [
                { model: User, attributes: ['id', 'username', 'email'] }, // Inkludiere Benutzerdetails
                { model: Car, attributes: ['id', 'brand', 'model', 'licensePlate'] } // Inkludiere Fahrzeugdetails
            ]
        });
        res.json(reservations);
    } catch (error) {
        console.error('Get reservations error:', error.message);
        res.status(500).send('Server error');
    }
};

// NEU: Einzelne Reservierung nach ID abrufen
export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findByPk(id, {
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: Car, attributes: ['id', 'brand', 'model', 'licensePlate'] }
            ]
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservierung nicht gefunden.' });
        }

        // Berechtigungsprüfung: Nur Admin oder der Besitzer der Reservierung darf abrufen
        if (req.user.role !== 'admin' && req.user.id !== reservation.userId) {
            return res.status(403).json({ message: 'Zugriff verweigert: Sie dürfen diese Reservierung nicht einsehen.' });
        }

        res.json(reservation);
    } catch (error) {
        console.error('getReservationById error:', error);
        res.status(500).json({ message: 'Serverfehler beim Abrufen der Reservierung.' });
    }
};

// Reservierung aktualisieren (Admin oder Besitzer)
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, status } = req.body; // Erlaubt das Aktualisieren von Zeiten und Status

        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservierung nicht gefunden.' });
        }

        // Berechtigungsprüfung: Nur Admin oder der Besitzer der Reservierung darf aktualisieren
        if (req.user.role !== 'admin' && req.user.id !== reservation.userId) {
            return res.status(403).json({ message: 'Zugriff verweigert: Sie dürfen diese Reservierung nicht aktualisieren.' });
        }

        // Aktualisiere Felder, wenn sie im Request-Body vorhanden sind
        if (startTime !== undefined) reservation.startTime = startTime;
        if (endTime !== undefined) reservation.endTime = endTime;
        // Status darf nur von Admins oder Mitarbeitern geändert werden (oder spezifische Übergänge für Nutzer)
        if (status !== undefined) {
            if (req.user.role === 'admin' || req.user.role === 'mitarbeiter') {
                reservation.status = status;
            } else {
                // Optional: Erlaube Nutzern nur bestimmte Statusänderungen, z.B. von 'pending' zu 'cancelled'
                if (status === 'cancelled' && reservation.status === 'pending') {
                    reservation.status = status;
                } else {
                    return res.status(403).json({ message: 'Zugriff verweigert: Sie dürfen den Status nicht ändern.' });
                }
            }
        }

        // Optional: Neuberechnung der Kosten bei Zeitänderung
        if (startTime !== undefined || endTime !== undefined) {
            const car = await Car.findByPk(reservation.carId);
            if (car) {
                const durationMs = new Date(reservation.endTime).getTime() - new Date(reservation.startTime).getTime();
                const durationHours = durationMs / (1000 * 60 * 60);
                reservation.totalCost = parseFloat((car.dailyRate * (durationHours / 24)).toFixed(2));
            }
        }

        await reservation.save();
        res.json({ message: 'Reservierung erfolgreich aktualisiert.', reservation });
    } catch (error) {
        console.error('Update reservation error:', error);
        res.status(500).json({ message: 'Serverfehler beim Aktualisieren der Reservierung.' });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservierung nicht gefunden.' });
        }

        // Berechtigungsprüfung: Nur Admin oder der Besitzer der Reservierung darf löschen
        if (req.user.role !== 'admin' && req.user.id !== reservation.userId) {
            return res.status(403).json({ message: 'Zugriff verweigert: Sie dürfen diese Reservierung nicht löschen.' });
        }

        await reservation.destroy();
        res.json({ message: 'Reservierung erfolgreich gelöscht.' });
    } catch (error) {
        console.error('Delete reservation error:', error);
        res.status(500).json({ message: 'Serverfehler beim Löschen der Reservierung.' });
    }
};
