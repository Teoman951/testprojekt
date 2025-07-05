//-----------------------------------------------------------
// models/User.js
//-----------------------------------------------------------
import { DataTypes } from 'sequelize';
import { sequelize }  from '../config/database.js';

const User = sequelize.define(
  'User',
  {
    /* ───────── Primärschlüssel ───────── */
    id: {
      type         : DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey   : true,
    },

    /* ───────── Account ───────── */
    username: {
      type     : DataTypes.STRING,
      allowNull: false,
      unique   : true,
    },
    email: {
      type     : DataTypes.STRING,
      allowNull: false,
      unique   : true,
      validate : { isEmail: true },
    },
    password: {
      type     : DataTypes.STRING,
      allowNull: false,
    },
    role: {
     type: DataTypes.ENUM('user', 'admin', 'mitarbeiter'),
      allowNull   : false,
      defaultValue: 'user',      // alternativ 'admin'
    },

    /* ───────── Führerschein ───────── */
    licenseNo: {
      type     : DataTypes.STRING,
      allowNull: true,
    },
    licenseIssue: {
      type     : DataTypes.DATEONLY,
      allowNull: true,
    },
    licenseExpiry: {
      type     : DataTypes.DATEONLY,
      allowNull: true,
    },
    licenseFrontPath: {
      type     : DataTypes.STRING,
      allowNull: true,
    },
    licenseBackPath: {
      type     : DataTypes.STRING,
      allowNull: true,
    },

    /* ───────── Payment ───────── */
    payType: {
      type     : DataTypes.STRING,   // 'card' | 'sepa' | 'paypal'
      allowNull: true,
    },
    iban: {
      type     : DataTypes.STRING,
      allowNull: true,
    },
    bic: {
      type     : DataTypes.STRING,
      allowNull: true,
    },
    cardNo: {
      type     : DataTypes.STRING,
      allowNull: true,
    },
    cardExp: {
      type     : DataTypes.STRING,
      allowNull: true,
    },
    cardCvc: {
      type     : DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
  }
);

export default User;