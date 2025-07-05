//-----------------------------------------------------------
//  utils/upload.js
//-----------------------------------------------------------
import multer from 'multer';
import path   from 'path';
import { fileURLToPath } from 'url';

// __dirname in ES-Modules ermitteln
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ---------- Storage ----------
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'licenses'));
  },
  filename:   (_, file, cb) => {
    // z.B.  licenseFront_1719859223456.jpg
    const ext = path.extname(file.originalname).toLowerCase();
    const prefix = file.fieldname;          // licenseFront / licenseBack
    cb(null, `${prefix}_${Date.now()}${ext}`);
  }
});

// ---------- Filter (optional) ----------
const imageFilter = (_, file, cb) => {
  if (/^image\/(jpeg|png)$/i.test(file.mimetype)) cb(null, true);
  else cb(new Error('Nur JPG/PNG erlaubt ⚠️'));
};

export const upload = multer({
  storage,
  fileFilter : imageFilter,
  limits     : { fileSize: 5 * 1024 * 1024 }   // 5 MB
});
