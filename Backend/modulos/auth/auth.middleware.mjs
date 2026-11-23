import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config.mjs';
import { buscarPorSesion } from './auth.modelo.mjs';
import { mostrarError } from './auth.vista.mjs';

// Devuelve el usuario dueño de la cookie de sesión, o null si no hay sesión válida.
// La sesión es válida si el JWT está firmado, no venció y su sessionId sigue
// guardado en la BD (al cerrar sesión se borra, invalidando el token).
export async function usuarioDeSesion(req) {
  const token = req.cookies.token;
  if (!token) return null;

  let datos;
  try {
    datos = jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }

  return buscarPorSesion(datos.id, datos.sessionId);
}

// Control de acceso: solo deja pasar peticiones con una sesión iniciada.
export async function requiereSesion(req, res, next) {
  try {
    const usuario = await usuarioDeSesion(req);

    if (!usuario) {
      return mostrarError(
        res,
        401,
        'Debés iniciar sesión para realizar esta acción.'
      );
    }

    req.usuario = usuario;
    return next();
  } catch (error) {
    return next(error);
  }
}
