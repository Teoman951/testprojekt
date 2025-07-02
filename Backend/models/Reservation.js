import { DataTypes } from 'sequelize';

// Das Modell wird als Funktion definiert, die eine initialisierte sequelize-Instanz erwartet!
export default (sequelize) => {
    const Reservation = sequelize.define('Reservation', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending', // Beispiele: 'pending', 'confirmed', 'cancelled'
        },
        totalCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        carId: { // Fremdschlüssel zu Car
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: { // Fremdschlüssel zu User
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: true,     // createdAt, updatedAt
        tableName: 'reservations', // Optional: echte Tabellenname
    });

    return Reservation;
};