'use strict';

// Endpoint de la API que entrega el catálogo de productos.
// La API corre de forma independiente del servidor estático del frontend.
const API_BASE_URL = 'http://localhost:3000';
const URL_PRODUCTOS = `${API_BASE_URL}/api/v1/productos`;

export async function cargarProductos() {
  const respuesta = await fetch(URL_PRODUCTOS);

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el catálogo de productos.');
  }

  const productos = await respuesta.json();

  return productos.map((producto) => ({
    ...producto,
    id: String(producto.id),
    precio: Number(producto.precio),
  }));
}
