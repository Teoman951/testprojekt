import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import multer from 'multer';

const router = Router();
const upload = multer();

router.post(
  '/register',
  upload.fields([
    { name: 'licenseFront', maxCount: 1 },  // <– Vorderseite
    { name: 'licenseBack',  maxCount: 1 }   // <– Rückseite
  ]),
  register                                  // dein Controller
);
router.post('/login', login);

export default router;