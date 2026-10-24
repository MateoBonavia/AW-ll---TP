import { Router } from 'express';
import {
  obtenerProductoPorId,
  obtenerProductos,
} from './productos.controlador.mjs';

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

export default router;
