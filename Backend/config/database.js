// Backend/config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// 1) Instanz erzeugen
export const sequelize = new Sequelize({
  dialect : 'sqlite',
  storage : './db.sqlite',   // beispielhaft, passe ggf. an
  logging : false,
});

// 2) Modelle registrieren
import defineUser  from '../models/User.js';
import defineRates from '../models/Rates.js';
import defineCar from '../models/Car.js';

export const User  = defineUser(sequelize);
export const Rate  = defineRates(sequelize);
export const Car  = defineCar(sequelize);     // NEU
export const User = defineUser(sequelize);
export const Rate = defineRates(sequelize);

// 3) Beziehungen (optional, aber meist erforderlich)
User.belongsTo(Rate, { foreignKey: 'rateId', as: 'AssignedRate' });
Rate.hasMany(User, { foreignKey: 'rateId', as: 'Users' });
User.belongsTo(Rate, { foreignKey: 'rateId', as: 'AssignedRate' });
Rate.hasMany(User, { foreignKey: 'rateId', as: 'Users' });

// 4) Helper zum Synchronisieren / Verbinden
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();    // { alter: true } o. Ä. nach Bedarf
    console.log('Datenbank verbunden und synchronisiert');
  } catch (err) {
    console.error('DB-Verbindung fehlgeschlagen:', err);
    process.exit(1);
  }
};