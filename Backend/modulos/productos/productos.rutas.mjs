import { Router } from 'express';
import { requiereSesion } from '../auth/auth.middleware.mjs';
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductoPorId,
  obtenerProductos,
} from './productos.controlador.mjs';

const router = Router();

// Lectura pública: cualquier visitante puede ver el catálogo.
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Administración del catálogo: requiere una sesión iniciada.
router.post('/', requiereSesion, crearProducto);
router.put('/:id', requiereSesion, actualizarProducto);
router.delete('/:id', requiereSesion, eliminarProducto);

export default router;
