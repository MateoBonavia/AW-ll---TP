import { buscarTodas } from './ligas.modelo.mjs';
import { mostrarLigas } from './ligas.vista.mjs';

export async function obtenerLigas(req, res, next) {
  try {
    const ligas = await buscarTodas();
    return mostrarLigas(res, ligas);
  } catch (error) {
    return next(error);
  }
}
