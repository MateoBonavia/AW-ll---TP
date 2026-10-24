import { buscarPorId, buscarTodos } from './productos.modelo.mjs';
import { mostrarError, mostrarProductos } from './productos.vista.mjs';

function leerId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
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

    return mostrarProductos(res, productos);
  } catch (error) {
    return next(error);
  }
}
