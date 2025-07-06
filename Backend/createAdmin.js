import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

import bcrypt from 'bcrypt';
import User from './models/User.js';
import { connectDB } from './config/database.js';


async function createAdmin() {
    await connectDB();  // Datenbankverbindung aufbauen

    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (adminExists) {
        console.log('Admin existiert bereits');
        return;
    }

    const passwordHash = await bcrypt.hash('AdminPass123!', 10);

    const adminUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: passwordHash,
        role: 'admin'
    });

    console.log('Admin-User wurde erstellt:', adminUser.username);
}

createAdmin()
    .then(() => process.exit())
    .catch(err => {
        console.error(err);
        process.exit(1);
    });