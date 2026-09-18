"use strict";

// Endpoint de la API que entrega el catálogo de productos.
const URL_PRODUCTOS = "https://6aab1be4ea0e22daa6dbcb90.mockapi.io/api/productos";

function normalizarLista(valor) {
  if (Array.isArray(valor)) return valor;

  if (typeof valor === "string" && valor.trim()) {
    return valor
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizarProducto(producto) {
  return {
    ...producto,
    imagenes:
      producto.imagenes ?? (producto.imagen ? [producto.imagen] : []),
    // La API puede devolver el precio como texto ("768.60"); el front lo usa como número.
    precio: Number(producto.precio),
    // La API usa "anio" sin ñ; el resto del front trabaja con "año".
    "año": String(producto["año"] ?? producto.anio ?? ""),
    tags: normalizarLista(producto.tags),
    talles: normalizarLista(producto.talles),
  };
}

export async function cargarProductos() {
  const respuesta = await fetch(URL_PRODUCTOS);

  // Una respuesta puede existir y aun así fallar, por ejemplo con error 404.
  if (!respuesta.ok) {
    throw new Error("No se pudo cargar el catálogo de productos.");
  }

  const productos = await respuesta.json();

  // Normaliza cada producto para que catálogo, filtros, detalle y carrito funcionen igual.
  return productos.map(normalizarProducto);
}
