import { DataTypes } from 'sequelize';
import {sequelize} from '../config/database.js'; // Pfad zu deiner Sequelize-Instanz

const Rates = sequelize.define('Rates', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Optional: Namen sollten einzigartig sein
    },
    pricePerHour: {
        type: DataTypes.DECIMAL(10, 2), // z.B. 10 Ziffern insgesamt, 2 Nachkommastellen
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true, // Fügt createdAt und updatedAt hinzu
    tableName: 'rates', // Optional: Der tatsächliche Tabellenname in der Datenbank
});

export default Rates;