import { Router } from 'express';
import {
  actualizarProducto,
  obtenerProductoPorId,
  obtenerProductos,
} from './productos.controlador.mjs';

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.put('/:id', actualizarProducto);

export default router;
