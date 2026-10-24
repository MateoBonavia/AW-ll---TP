import { actualizarPorId, buscarPorId, buscarTodos } from './productos.modelo.mjs';
import {
  mostrarError,
  mostrarProducto,
  mostrarProductos,
} from './productos.vista.mjs';

function leerId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Valida datos externos y los deja listos para persistir en PostgreSQL.
function validarYPrepararProducto(body) {
  const anio = body['año'] ?? body.anio;
  const precio = Number(body.precio);
  const arreglos = ['imagenes', 'talles', 'tags'];

  if (!body.nombre || typeof body.nombre !== 'string' || !body.nombre.trim()) return null;
  if (!Number.isFinite(precio) || precio < 0) return null;
  if (arreglos.some((campo) => !Array.isArray(body[campo]))) return null;
  if (body.liga_id !== null && body.liga_id !== undefined && !Number.isInteger(Number(body.liga_id))) return null;

  return {
    nombre: body.nombre.trim(),
    descripcion: typeof body.descripcion === 'string' ? body.descripcion : '',
    precio,
    etiqueta: typeof body.etiqueta === 'string' && body.etiqueta.trim() ? body.etiqueta.trim() : null,
    anio: typeof anio === 'string' && anio.trim() ? anio.trim() : null,
    liga_id: body.liga_id === null || body.liga_id === undefined ? null : Number(body.liga_id),
    imagenes: body.imagenes,
    talles: body.talles,
    tags: body.tags,
  };
}

export async function obtenerProductos(req, res, next) {
  try {
    const productos = await buscarTodos();
    return mostrarProductos(res, productos);
  } catch (error) {
    return next(error);
  }
}

export async function obtenerProductoPorId(req, res, next) {
  const id = leerId(req.params.id);

  if (id === null) {
    return mostrarError(res, 400, 'El id debe ser un número entero positivo.');
  }

  try {
    const productos = await buscarPorId(id);

    if (productos.length === 0) {
      return mostrarError(
        res,
        404,
        'No se encontró un producto con el id ingresado.'
      );
    }

    return mostrarProducto(res, productos[0]);
  } catch (error) {
    return next(error);
  }
}

export async function actualizarProducto(req, res, next) {
  const id = leerId(req.params.id);
  if (id === null) return mostrarError(res, 400, 'El id debe ser un número entero positivo.');

  const producto = validarYPrepararProducto(req.body);
  if (producto === null) return mostrarError(res, 400, 'Los datos enviados son inválidos.');

  try {
    const productos = await actualizarPorId(id, producto);
    if (productos.length === 0) {
      return mostrarError(res, 404, 'No se encontró un producto con el id ingresado.');
    }
    return mostrarProducto(res, productos[0]);
  } catch (error) {
    return next(error);
  }
}
