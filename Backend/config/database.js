import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// 1) Instanz erzeugen
export const sequelize = new Sequelize({
  dialect : 'sqlite',
  storage : './db.sqlite',
  logging : false,
});

// 2) Modelle registrieren
import defineUser  from '../models/User.js';
import defineRates from '../models/Rates.js';
import defineCar   from '../models/Car.js';

export const User = defineUser(sequelize);
export const Rate = defineRates(sequelize);
export const Car  = defineCar(sequelize);

// 3) Beziehungen
User.belongsTo(Rate, { foreignKey: 'rateId', as: 'AssignedRate' }); // EINDEUTIGE Zuordnung
Rate.hasMany(User, { foreignKey: 'rateId', as: 'Users' });

// 4) Helper zum Synchronisieren / Verbinden
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Datenbank erfolgreich verbunden und synchronisiert');
  } catch (err) {
    console.error('Datenbank-Verbindungsfehler:', err);
    process.exit(1);
  }
};