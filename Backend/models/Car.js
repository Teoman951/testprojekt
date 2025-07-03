

// Backend/models/Car.js
// Fabrikfunktion – erhält die Sequelize-Instanz

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Car = sequelize.define('Car', {
    id: {
      type         : DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey   : true,
      allowNull    : false,
    },
    licensePlate: {
      type  : DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    brand : { type: DataTypes.STRING, allowNull: false },
    model : { type: DataTypes.STRING, allowNull: false },
    year  : { type: DataTypes.INTEGER, allowNull: false },

    color    : DataTypes.STRING,
    location : DataTypes.STRING,
    dailyRate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    timestamps: true,
    tableName : 'cars',
  });

  return Car;
};