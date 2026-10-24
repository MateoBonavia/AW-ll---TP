'use strict';

// Endpoint de la API que entrega las ligas disponibles.
// Se usa la misma base que productos para que Live Server (puerto 5500)
// consulte al backend que corre en el puerto 3000.
const API_BASE_URL = 'http://localhost:3000';
const URL_LIGAS = `${API_BASE_URL}/api/v1/ligas`;

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
