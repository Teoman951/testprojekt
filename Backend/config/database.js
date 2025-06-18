import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Workaround für __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE,
    logging: false, // Setze auf true, um SQL-Queries in der Konsole zu sehen
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

export { sequelize, connectDB };