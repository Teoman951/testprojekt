import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Reservation from '../models/Reservation.js';

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden' });

        await user.destroy();
        res.json({ message: 'Benutzer gelöscht' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Löschen', error });
    }
};

export const createCar = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Erstellen', error });
    }
};

export const updateCar = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Fahrzeug nicht gefunden' });

        await vehicle.update(req.body);
        res.json({ message: 'Fahrzeug aktualisiert', vehicle });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Aktualisieren', error });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Reservierung nicht gefunden' });

        await reservation.destroy();
        res.json({ message: 'Reservierung gelöscht' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Löschen', error });
    }
};
