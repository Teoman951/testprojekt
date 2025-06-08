import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Car = sequelize.define('Car', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    licensePlate: { // Kennzeichen
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
    },
    location: { // Aktueller Standort des Fahrzeugs
        type: DataTypes.STRING,
        allowNull: false,
    },
    dailyRate: { // Tagespreis in Euro
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
});

export default Car;