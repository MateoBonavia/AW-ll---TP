"use strict";

// Endpoint de la API que entrega las ligas disponibles.
const URL_LIGAS = "https://6aab1be4ea0e22daa6dbcb90.mockapi.io/api/liga";

export async function cargarLigas() {
  const respuesta = await fetch(URL_LIGAS);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las ligas.");
  }

  const ligas = await respuesta.json();

  // El id se usa como valor de las casillas, por eso se unifica como texto.
  return ligas
    .map((liga) => ({ id: String(liga.id), nombre: liga.nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}
