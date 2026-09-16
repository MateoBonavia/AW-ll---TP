"use strict";

import { cargarProductos } from "./productos.js";
import { inicializarCatalogo, renderizarCatalogo } from "./catalogo.js";
import { inicializarFiltros } from "./filtros.js";
import { inicializarSpa } from "./spa.js";
import { inicializarCarrito } from "./carrito.js";
import { cargarFooter, cargarHeader } from "./componentes.js";
import { inicializarFormularios } from "./formularios.js";

// Punto de entrada: espera los datos antes de activar las vistas del sitio.
async function iniciarAplicacion() {
  const contenedor = document.getElementById("contenedor-tarjetas");

  try {
    // Los componentes compartidos deben existir antes de conectar sus interacciones.
    await Promise.all([cargarHeader(), cargarFooter()]);
    inicializarFormularios();

    // await pausa solo esta función hasta que el archivo JSON esté disponible.
    const productos = await cargarProductos();

    // Catálogo y detalle reciben la misma lista para mostrar datos coherentes.
    // El carrito se prepara una vez y sus acciones se pasan al detalle SPA.
    const carrito = inicializarCarrito();
    inicializarCatalogo(productos);
    inicializarFiltros(productos, renderizarCatalogo);
    inicializarSpa(productos, carrito);
  } catch (error) {
    // Si falla la carga, se muestra un mensaje en vez de dejar un área vacía.
    console.error(error);

    if (contenedor) {
      contenedor.innerHTML = "<p role=\"alert\">No se pudo cargar el catálogo. Intentá nuevamente más tarde.</p>";
    }
  }
}

iniciarAplicacion();
