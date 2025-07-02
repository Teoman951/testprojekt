import { Car, User, Rate } from '../config/database.js';
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
                    { // Neue Reservierung beginnt während einer bestehenden
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

// Reservierung nach ID abrufen
export const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: Car, attributes: ['id', 'brand', 'model', 'licensePlate'] }
            ]
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Sicherstellen, dass nur der eigene Benutzer oder ein Admin die Reservierung sehen kann
        if (req.user.role !== 'admin' && reservation.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this reservation' });
        }

        res.json(reservation);
    } catch (error) {
        console.error('Get reservation by ID error:', error.message);
        res.status(500).send('Server error');
    }
};


// Reservierung aktualisieren (Admin oder Besitzer, eingeschränkt)
export const updateReservation = async (req, res) => {
    const { id } = req.params;
    const { startTime, endTime, status, totalCost, carId, userId } = req.body; // Admin könnte mehr ändern

    try {
        let reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Nur Admin oder der Besitzer der Reservierung darf ändern
        if (req.user.role !== 'admin' && reservation.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this reservation' });
        }

        // Benutzer darf nur bestimmte Felder ändern (z.B. Zeiträume, nicht Status oder Kosten)
        // Admin darf alles ändern
        if (req.user.role === 'admin') {
            reservation.startTime = startTime || reservation.startTime;
            reservation.endTime = endTime || reservation.endTime;
            reservation.status = status || reservation.status;
            reservation.totalCost = totalCost || reservation.totalCost;
            reservation.carId = carId || reservation.carId;
            reservation.userId = userId || reservation.userId;
        } else {
            // Normale Benutzer dürfen nur startTime und endTime ändern (oder stornieren)
            reservation.startTime = startTime || reservation.startTime;
            reservation.endTime = endTime || reservation.endTime;
            if (status === 'cancelled') { // Beispiel: Benutzer kann nur stornieren
                reservation.status = status;
            }
        }

        await reservation.save();
        res.json({ message: 'Reservation updated successfully', reservation });
    } catch (error) {
        console.error('Update reservation error:', error.message);
        res.status(500).send('Server error');
    }
};

// Reservierung löschen (Admin oder Besitzer)
export const deleteReservation = async (req, res) => {
    const { id } = req.params;
    try {
        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Nur Admin oder der Besitzer der Reservierung darf löschen
        if (req.user.role !== 'admin' && reservation.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this reservation' });
        }

        await reservation.destroy();
        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error('Delete reservation error:', error.message);
        res.status(500).send('Server error');
    }
};