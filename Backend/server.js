import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, sequelize } from './config/database.js'; // sequelize importieren
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import carRoutes from './routes/carRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import ratesRoutes from "./routes/ratesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // CORS für Frontend-Kommunikation
app.use(express.json()); // Body-Parser für JSON-Anfragen

// Routen
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/rates', ratesRoutes);

// Standard-Route
app.get('/', (req, res) => {
    res.send('Welcome to the DriveLink Backend!');
});

// Datenbankverbindung und Serverstart
const startServer = async () => {
    try {
        await connectDB();
        // Synchronisiere alle Modelle mit der Datenbank
        // force: false bedeutet, dass Tabellen nur erstellt werden, wenn sie nicht existieren.
        // Bei force: true würden Tabellen bei jedem Start gelöscht und neu erstellt (gut für Entwicklung, löscht aber Daten!)
        await sequelize.sync({ force: false });
        console.log('All models synchronized successfully.');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to database or start server:', error);
        process.exit(1); // Beendet den Prozess bei einem Fehler
    }
};

startServer().then(r => {});