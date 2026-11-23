'use strict';

import { CREDENCIALES, URL_PRODUCTOS } from './config.js';

// Lee la respuesta de la API: devuelve los datos o lanza un Error con su mensaje.
async function leerRespuesta(respuesta, mensajePorDefecto) {
  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(datos.error || mensajePorDefecto);
    error.estado = respuesta.status;
    throw error;
  }

  return datos;
}

export async function cargarProductos() {
  const respuesta = await fetch(URL_PRODUCTOS);

  // La API es el contrato: el frontend conserva sus tipos sin adaptarlos.
  return leerRespuesta(respuesta, 'No se pudo cargar el catálogo de productos.');
}

export async function cargarProductoPorId(id) {
  const respuesta = await fetch(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`);

  return leerRespuesta(respuesta, 'No se pudo cargar el producto solicitado.');
}

// Las operaciones de administración envían la cookie de sesión (requieren login).
export async function crearProducto(producto) {
  const respuesta = await fetch(URL_PRODUCTOS, {
    method: 'POST',
    body: producto,
    credentials: CREDENCIALES,
  });

  return leerRespuesta(respuesta, 'No se pudo crear el producto.');
}

export async function actualizarProducto(id, producto) {
  const respuesta = await fetch(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: producto,
    credentials: CREDENCIALES,
  });

  return leerRespuesta(respuesta, 'No se pudo actualizar el producto.');
}

export async function eliminarProducto(id) {
  const respuesta = await fetch(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: CREDENCIALES,
  });

  return leerRespuesta(respuesta, 'No se pudo eliminar el producto.');
}
