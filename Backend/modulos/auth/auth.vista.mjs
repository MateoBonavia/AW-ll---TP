import { responderError, responderMensaje } from '../respuestas.mjs';

const DURACION_SESION = 24 * 60 * 60 * 1000; // 1 día, igual que el JWT.

export function mostrarSesionIniciada(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: DURACION_SESION,
  });

  return responderMensaje(res, 200, 'Sesión iniciada.');
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
