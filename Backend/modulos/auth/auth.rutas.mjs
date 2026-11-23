import { Router } from 'express';
import {
  cerrarSesion,
  iniciarSesion,
  obtenerSesion,
  registrarse,
} from './auth.controlador.mjs';

const router = Router();

router.post('/login', iniciarSesion);
router.post('/logout', cerrarSesion);
router.get('/sesion', obtenerSesion);
router.post('/registrarse', registrarse);

export default router;
