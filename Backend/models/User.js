import { DataTypes } from 'sequelize';

// Exportiert eine Funktion, die das Modell definiert
export default (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user', // 'user' oder 'admin'
        },
        rateId: { // Fremdschlüssel für den Tarif
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Rates', // Tabellenname für Tarife
                key: 'id',
            },
        }
    });

    return User;
};