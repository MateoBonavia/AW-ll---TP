"use strict";

/**
 * Carga el catálogo desde el archivo JSON local.
 * @returns {Promise<Array>} Productos disponibles.
 */
export async function cargarProductos() {
  // fetch lee el JSON local sin declarar productos dentro de JavaScript.
  const respuesta = await fetch("./datos/productos.json");

  // Una respuesta puede existir y aun así fallar, por ejemplo con error 404.
  if (!respuesta.ok) {
    throw new Error("No se pudo cargar el catálogo de productos.");
  }

  // Convierte el texto JSON en el array que usará el resto de la aplicación.
  return respuesta.json();
}
