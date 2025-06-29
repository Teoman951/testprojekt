// Backend/config/database.js
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); // Umgebungsvariablen laden

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sequelize Instanz initialisieren
// Verwendet SQLite als Datenbank und speichert die Datei im 'data'-Ordner.
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', process.env.DB_STORAGE || 'data/carsharing_db.sqlite'), // Pfad zur SQLite-Datei
    logging: false, // Setze auf true, um SQL-Queries in der Konsole zu sehen
});

// Importiere Modelle
import User from '../models/User.js';
import Car from '../models/Car.js';
import Reservation from '../models/Reservation.js';
import Rate from '../models/Rate.js'; // Rate-Modell importieren

// Definiere Assoziationen (Beziehungen zwischen Modellen)

// Ein Benutzer kann viele Reservierungen haben
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

// Ein Auto kann viele Reservierungen haben
Car.hasMany(Reservation, { foreignKey: 'carId' });
Reservation.belongsTo(Car, { foreignKey: 'carId' });

// NEU: Assoziation zwischen User und Rate
// Ein Benutzer gehört zu einem Tarif (Rate)
User.belongsTo(Rate, { foreignKey: 'rateId', as: 'AssignedRate' }); // 'as: "AssignedRate"' für leichteren Zugriff beim Include
// Eine Rate kann von vielen Benutzern genutzt werden
Rate.hasMany(User, { foreignKey: 'rateId' });


// Funktion zum Testen der Datenbankverbindung
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error; // Fehler weiterwerfen
    }
};
