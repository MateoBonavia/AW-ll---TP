import {
  responderDatos,
  responderError,
  responderMensaje,
} from '../respuestas.mjs';

export function mostrarProductos(res, productos) {
  return responderDatos(res, 200, productos);
}

export function mostrarProducto(res, producto) {
  return responderDatos(res, 200, producto);
}

export function mostrarError(res, estado, mensaje) {
  return responderError(res, estado, mensaje);
}

export function mostrarProductoCreado(res, producto) {
  return responderDatos(res, 201, producto);
}

// Devuelve el producto borrado para que el Front-End sepa qué se eliminó.
export function mostrarProductoEliminado(res, producto) {
  return responderMensaje(res, 200, 'Producto eliminado correctamente.', {
    producto,
  });
}
