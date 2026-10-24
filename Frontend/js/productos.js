'use strict';

const API_BASE_URL = 'http://localhost:3000';
const URL_PRODUCTOS = `${API_BASE_URL}/api/v1/productos`;

export async function cargarProductos() {
  const respuesta = await fetch(URL_PRODUCTOS);

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el catálogo de productos.');
  }

  // La API es el contrato: el frontend conserva sus tipos sin adaptarlos.
  return respuesta.json();
}

export async function cargarProductoPorId(id) {
  const respuesta = await fetch(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`);

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el producto solicitado.');
  }

  return respuesta.json();
}

export async function actualizarProducto(id, producto) {
  const respuesta = await fetch(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: producto,
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}));
    throw new Error(error.error || 'No se pudo actualizar el producto.');
  }

  return respuesta.json();
}
