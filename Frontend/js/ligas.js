'use strict';

// Endpoint de la API que entrega las ligas disponibles.
const URL_LIGAS = 'http://localhost:3000/liga';

export async function cargarLigas() {
  const respuesta = await fetch(URL_LIGAS);

  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las ligas.');
  }

  const ligas = await respuesta.json();

  return ligas
    .map((liga) => ({ id: String(liga.id), nombre: liga.nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}
