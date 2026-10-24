import { Router } from 'express';
import {
  crearProducto,
  eliminarProducto,
  obtenerProductoPorId,
  obtenerProductos,
} from './productos.controlador.mjs';

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/', crearProducto);
router.delete('/:id', eliminarProducto);

export default router;