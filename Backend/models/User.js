import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

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
    role: { // z.B. 'user', 'admin'
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
    // Weitere Felder können hier hinzugefügt werden (z.B. firstName, lastName, etc.)
});

export default User;