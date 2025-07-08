//-----------------------------------------------------------
// server.js   (oder app.js – ganz wie bei dir)
//-----------------------------------------------------------
import express  from 'express';
import cors     from 'cors';
import dotenv   from 'dotenv';
import { fileURLToPath } from 'url';

import { connectDB, sequelize } from './config/database.js';

import authRoutes        from './routes/authRoutes.js';
import userRoutes        from './routes/userRoutes.js';
import carRoutes         from './routes/carRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import ratesRoutes       from './routes/ratesRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // NEUER IMPORT

import User from './models/User.js';
import Car from './models/Car.js';
import Reservation from './models/Reservation.js';
import Rates from './models/Rates.js';
import path from "path";
import staff from "./models/Staff.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* ───────────────────── Middleware ─────────────────────── */

//  JSON  +  URL-encoded  (für Text-Payloads)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  CORS  für dein Frontend
app.use(cors());

/* ───────────────────── Routen ─────────────────────────── */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/rates', ratesRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes); // NEU HINZUGEFÜGT

//   Static-Files: Führerschein-Bilder ausliefern
//     (Multer legt sie in uploads/licenses/ ab)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));   //  <- NEU

app.get('/', (_req, res) => res.send('Welcome to the MoveSnart Backend!'));

/* ───────────────────── DB & Server ────────────────────── */

const startServer = async () => {
  try {
    await connectDB();

     //  Modellassoziationen
        User.hasMany(Reservation, { foreignKey: 'userId' });
        Reservation.belongsTo(User, { foreignKey: 'userId' });

        Car.hasMany(Reservation, { foreignKey: 'carId' });
        Reservation.belongsTo(Car, { foreignKey: 'carId' });

        User.belongsTo(Rates, { foreignKey: 'rateId', as: 'AssignedRate' });
        Rates.hasMany(User, { foreignKey: 'rateId' });

    //  Schema automatisch **angleichen** - Temporär wieder aktiviert, um userId und carId in reservations zu erstellen
    await sequelize.sync({ alter: true });
    console.log('All models synchronized (alter:true). REMEMBER TO COMMENT THIS OUT AGAIN OR REPLACE WITH AUTHENTICATE AFTER SCHEMA IS FIXED.');

    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();