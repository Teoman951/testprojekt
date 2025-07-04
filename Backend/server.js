// Backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, sequelize } from './config/database.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import carRoutes from './routes/carRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import ratesRoutes from './routes/ratesRoutes.js';

import User from './models/User.js';
import Car from './models/Car.js';
import Reservation from './models/Reservation.js';
import Rates from './models/Rates.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/rates', ratesRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the DriveLink Backend!');
});

const startServer = async () => {
    try {
        await connectDB();

        // 🔗 Modellassoziationen
        User.hasMany(Reservation, { foreignKey: 'userId' });
        Reservation.belongsTo(User, { foreignKey: 'userId' });

        Car.hasMany(Reservation, { foreignKey: 'carId' });
        Reservation.belongsTo(Car, { foreignKey: 'carId' });

        User.belongsTo(Rates, { foreignKey: 'rateId', as: 'AssignedRate' });
        Rates.hasMany(User, { foreignKey: 'rateId' });

        // ⛏ Synchronisiere alle Modelle mit den Beziehungen
        await sequelize.sync({ alter: true }); // alter: true = passt Tabellen an, ohne Daten zu verlieren
        console.log('All models synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to database or start server:', error);
        process.exit(1);
    }
};

startServer();
