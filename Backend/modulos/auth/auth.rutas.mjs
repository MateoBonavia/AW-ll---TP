import { Router } from 'express';
import {
  iniciarSesion,
  obtenerSesion,
  registrarse,
} from './auth.controlador.mjs';

const router = Router();

router.post('/login', iniciarSesion);
router.get('/sesion', obtenerSesion);
router.post('/registrarse', registrarse);

export default router;
