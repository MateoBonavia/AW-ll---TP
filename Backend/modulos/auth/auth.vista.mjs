import { COOKIE_SEGURA } from '../../config.mjs';
import { responderError, responderMensaje } from '../respuestas.mjs';

const DURACION_SESION = 24 * 60 * 60 * 1000; // 1 día, igual que el JWT.

// Las mismas opciones sirven para crear y para borrar la cookie.
const OPCIONES_COOKIE = {
  httpOnly: true, // JavaScript del navegador no puede leer el token.
  secure: COOKIE_SEGURA,
  sameSite: 'lax',
  path: '/',
};

export function mostrarSesionIniciada(res, token) {
  res.cookie('token', token, { ...OPCIONES_COOKIE, maxAge: DURACION_SESION });

  return responderMensaje(res, 200, 'Sesión iniciada.');
}

export function mostrarSesionCerrada(res) {
  res.clearCookie('token', OPCIONES_COOKIE);

  return responderMensaje(res, 200, 'Sesión cerrada.');
}

export function mostrarSesion(res, usuario) {
  return responderMensaje(res, 200, 'Sesión activa.', {
    autenticado: true,
    usuario,
  });
}

export function mostrarSinSesion(res) {
  return responderError(res, 401, 'No hay una sesión activa.');
}

export function mostrarUsuarioCreado(res) {
  return responderMensaje(res, 201, 'Usuario creado correctamente.');
}

export function mostrarError(res, estado, mensaje) {
  return responderError(res, estado, mensaje);
}
