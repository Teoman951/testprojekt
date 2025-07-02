import { Car } from '../config/database.js';   // statt früherem Direkt-Import


// Fahrzeug erstellen (nur Admins)
export const createCar = async (req, res) => {
    const { licensePlate, brand, model, year, color, location, dailyRate } = req.body;
    try {
        const newCar = await Car.create({
            licensePlate, brand, model, year, color, location, dailyRate
        });
        res.status(201).json({ message: 'Car created successfully', car: newCar });
    } catch (error) {
        console.error('Create car error:', error.message);
        res.status(500).send('Server error');
    }
};

// Alle Fahrzeuge abrufen
export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.findAll();
        res.json(cars);
    } catch (error) {
        console.error('Get all cars error:', error.message);
        res.status(500).send('Server error');
    }
};

// Einzelnes Fahrzeug abrufen
export const getCarById = async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(car);
    } catch (error) {
        console.error('Get car by ID error:', error.message);
        res.status(500).send('Server error');
    }
};

// Fahrzeug aktualisieren (nur Admins)
export const updateCar = async (req, res) => {
    const { id } = req.params;
    const { licensePlate, brand, model, year, color, location, dailyRate, isAvailable } = req.body;
    try {
        let car = await Car.findByPk(id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        car.licensePlate = licensePlate || car.licensePlate;
        car.brand = brand || car.brand;
        car.model = model || car.model;
        car.year = year || car.year;
        car.color = color || car.color;
        car.location = location || car.location;
        car.dailyRate = dailyRate || car.dailyRate;
        car.isAvailable = (typeof isAvailable === 'boolean') ? isAvailable : car.isAvailable;

        await car.save();
        res.json({ message: 'Car updated successfully', car });
    } catch (error) {
        console.error('Update car error:', error.message);
        res.status(500).send('Server error');
    }
};

// Fahrzeug löschen (nur Admins)
export const deleteCar = async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        await car.destroy();
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Delete car error:', error.message);
        res.status(500).send('Server error');
    }
};