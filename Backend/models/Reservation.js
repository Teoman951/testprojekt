import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Car from './Car.js';

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    totalCost: { // Berechnete Kosten der Reservierung
        type: DataTypes.FLOAT,
        allowNull: true, // Kann anfangs null sein und später berechnet werden
    },
    status: { // z.B. 'pending', 'confirmed', 'completed', 'cancelled'
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
    },
});

// Definition der Assoziationen
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Car.hasMany(Reservation, { foreignKey: 'carId' });
Reservation.belongsTo(Car, { foreignKey: 'carId' });

export default Reservation;