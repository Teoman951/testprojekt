// Backend/models/User.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js'; // Stellt sicher, dass sequelize hier korrekt importiert wird
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
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
        type: DataTypes.ENUM('user', 'admin'), // Inklusive 'employee' wenn du diese Rolle hinzufügen möchtest
        defaultValue: 'user',
    },
    // NEU: Fremdschlüssel für den Tarif (Rate)
    rateId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Kann null sein, wenn kein Tarif zugewiesen ist
        references: {
            model: 'Rates', // Verweist auf die Tabelle 'Rates' (wird von Sequelize automatisch pluralisiert)
            key: 'id',
        },
        onDelete: 'SET NULL', // Wenn ein Tarif gelöscht wird, setze rateId auf NULL
        onUpdate: 'CASCADE',  // Wenn die Rate ID aktualisiert wird, aktualisiere hier
    }
}, {
    timestamps: true, // Fügt createdAt und updatedAt hinzu
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user) => {
            // Wenn das Passwort geändert wird, hashe es neu
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
    },
});

export default User;
