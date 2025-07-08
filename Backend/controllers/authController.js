//-----------------------------------------------------------
// controllers/authController.js
//-----------------------------------------------------------
import bcrypt   from 'bcryptjs';
import jwt      from 'jsonwebtoken';
import path     from 'path';
import User     from '../models/User.js';

/* --------------------------------------------------------
   POST /api/auth/register
   ------------------------------------------------------ */
export const register = async (req, res) => {
  try {
    //------------------------------------------------------
    // 1. Body-Daten + Dateien auslesen
    //------------------------------------------------------
    const {
      username, email, password,                       // StepAccount
      licenseNo, licenseIssue, licenseExpiry,          // StepLicense
      payType, iban, bic, cardNo, cardExp, cardCvc     // StepPayment
    } = req.body;

    const frontFile = req.files?.licenseFront?.[0];
    const backFile  = req.files?.licenseBack?.[0]; // Bleibt optional

    // Validierung – nur das vordere Führerschein-Foto ist Pflicht
    if (!frontFile)
      return res.status(400).json({ message: 'Das vordere Führerschein-Foto ist Pflicht.' });

    //------------------------------------------------------
    // 2. Existiert die Mail schon?
    //------------------------------------------------------
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'E-Mail existiert bereits.' });

    //------------------------------------------------------
    // 3. Passwort hashen
    //------------------------------------------------------
    const hash = await bcrypt.hash(password, 10);

    //------------------------------------------------------
    // 4. Datensatz speichern
    //------------------------------------------------------
    user = await User.create({
      username,
      email,
      password         : hash,
      role             : 'user',

      //  🆕  Führerschein
      licenseNo,
      licenseIssue,
      licenseExpiry,
      licenseFrontPath : frontFile.filename,
      licenseBackPath  : backFile ? backFile.filename : null, // Nur setzen, wenn vorhanden

      //  🆕  Payment (je nach Typ nur ein Teil gefüllt)
      payType,
      iban, bic,
      cardNo, cardExp, cardCvc
    });

    //------------------------------------------------------
    // 5. JWT ausstellen
    //------------------------------------------------------
    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ message: 'Registrierung erfolgreich', token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------------------------------------
   POST /api/admin/staff/register (Protected by admin role)
   ------------------------------------------------------ */
export const registerStaff = async (req, res) => {
  try {
    //------------------------------------------------------
    // 1. Body-Daten auslesen
    //------------------------------------------------------
    const {
      username, email, password,
    } = req.body;

    // Validierung – hier sehr knapp, in echt besser ausführen
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Benutzername, E-Mail und Passwort sind erforderlich.' });
    }

    //------------------------------------------------------
    // 2. Existiert die Mail schon?
    //------------------------------------------------------
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'E-Mail existiert bereits.' });

    //------------------------------------------------------
    // 3. Passwort hashen
    //------------------------------------------------------
    const hash = await bcrypt.hash(password, 10);

    //------------------------------------------------------
    // 4. Datensatz speichern
    //------------------------------------------------------
    user = await User.create({
      username,
      email,
      password: hash,
      role: 'mitarbeiter', // Rolle direkt auf 'mitarbeiter' setzen
      // Keine Lizenz- oder Zahlungsinformationen für Mitarbeiter erforderlich
    });

    //------------------------------------------------------
    // 5. Erfolgsmeldung (kein JWT, da Admin bereits eingeloggt ist)
    //------------------------------------------------------
    res.status(201).json({ message: 'Mitarbeiter erfolgreich registriert', userId: user.id });

  } catch (err) {
    console.error('Staff registration error:', err);
    // Spezifischere Fehlermeldungen könnten hier hilfreich sein
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Validierungsfehler', errors: err.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Server error bei der Mitarbeiterregistrierung' });
  }
};


/* --------------------------------------------------------
   POST /api/auth/login  – unverändert
   ------------------------------------------------------ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ message: 'Logged in successfully', token });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
