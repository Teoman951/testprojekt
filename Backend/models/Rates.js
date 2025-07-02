// Backend/models/Rates.js
// ACHTUNG: kein sequelize-Import mehr!
// Stattdessen eine Funktion exportieren, die die Instanz entgegennimmt.

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Rates = sequelize.define('Rates', {
    id: {
      type         : DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey   : true,
      allowNull    : false,
    },
    name: {
      type : DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pricePerHour: {
      type : DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type : DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
    tableName : 'rates',
  });

  return Rates;
};