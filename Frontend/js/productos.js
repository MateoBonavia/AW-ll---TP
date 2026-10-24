'use strict';

const API_BASE_URL = 'http://localhost:3000';
const URL_PRODUCTOS = `${API_BASE_URL}/api/v1/productos`;

function normalizarProducto(producto) {
  return {
    ...producto,
    id: String(producto.id),
    precio: Number(producto.precio),
  };
}

export async function cargarProductos() {
  const respuesta = await fetch(URL_PRODUCTOS);

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el catálogo de productos.');
  }

  const productos = await respuesta.json();

  return productos.map(normalizarProducto);
}

export async function cargarProductoPorId(id) {
  const respuesta = await fetch(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`);

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el producto solicitado.');
  }

  return normalizarProducto(await respuesta.json());
}
