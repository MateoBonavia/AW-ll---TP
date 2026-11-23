import { Router } from 'express';
import { obtenerLigas } from './ligas.controlador.mjs';

const router = Router();

router.get('/', obtenerLigas);

export default router;
