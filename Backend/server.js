//-----------------------------------------------------------
// server.js   (oder app.js – ganz wie bei dir)
//-----------------------------------------------------------
import express  from 'express';
import cors     from 'cors';
import dotenv   from 'dotenv';

import { connectDB, sequelize } from './config/database.js';

import authRoutes        from './routes/authRoutes.js';
import userRoutes        from './routes/userRoutes.js';
import carRoutes         from './routes/carRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import ratesRoutes       from './routes/ratesRoutes.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

/* ───────────────────── Middleware ─────────────────────── */

// 1️⃣  JSON  +  URL-encoded  (für Text-Payloads)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   //  <- NEU (für FormData-Fallbacks)

// 2️⃣  CORS  für dein Frontend
app.use(cors());

// 3️⃣  Static-Files: Führerschein-Bilder ausliefern
//     (Multer legt sie in uploads/licenses/ ab)
app.use('/uploads', express.static('uploads'));    //  <- NEU

/* ───────────────────── Routen ─────────────────────────── */

app.use('/api/auth',         authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/cars',         carRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/rates',        ratesRoutes);

app.get('/', (_req, res) => res.send('Welcome to the DriveLink Backend!'));

/* ───────────────────── DB & Server ────────────────────── */

const startServer = async () => {
  try {
    await connectDB();

    // 4️⃣  Schema automatisch **angleichen**
    await sequelize.sync({ force: true }); 
    console.log('All models synchronized (alter:true)');

    app.listen(PORT, () =>
      console.log(`Server ready  👉  http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
