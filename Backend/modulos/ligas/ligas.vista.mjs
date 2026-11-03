import { responderDatos } from '../respuestas.mjs';

export function mostrarLigas(res, ligas) {
  return responderDatos(res, 200, ligas);
}
