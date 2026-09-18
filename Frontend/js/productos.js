'use strict';

// Endpoint de la API que entrega el catálogo de productos.
const URL_PRODUCTOS = 'http://localhost:3000/productos';

export async function cargarProductos() {
  const respuesta = await fetch(URL_PRODUCTOS);

  // Una respuesta puede existir y aun así fallar, por ejemplo con error 404.
  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el catálogo de productos.');
  }

  // La API ya entrega los productos en el formato que usa la aplicación.
  return await respuesta.json();
}
