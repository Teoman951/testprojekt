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
const sequelize = new Sequelize({ // KORREKTUR: 'export' hier entfernt
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', process.env.DB_STORAGE || 'data/carsharing_db.sqlite'), // Pfad zur SQLite-Datei
    logging: false, // Setze auf true, um SQL-Queries in der Konsole zu sehen
});

// Funktion zum Testen der Datenbankverbindung
const connectDB = async () => { // KORREKTUR: 'export' hier entfernt
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error; // Fehler weiterwerfen
    }
};

// KORREKTUR: Nur ein einziger Export-Block am Ende
export {sequelize, connectDB};

// WICHTIG: Modellimporte und Assoziationsdefinitionen wurden hier entfernt.
// Sie werden nun in server.js nach der Initialisierung von sequelize gehandhabt.
