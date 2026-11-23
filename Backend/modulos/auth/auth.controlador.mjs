import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { JWT_SECRET } from '../../config.mjs';
import {
  buscarPorCorreo,
  guardarSesion,
  insertarUsuario,
} from './auth.modelo.mjs';
import {
  mostrarError,
  mostrarSesion,
  mostrarSesionCerrada,
  mostrarSesionIniciada,
  mostrarSinSesion,
  mostrarUsuarioCreado,
} from './auth.vista.mjs';
import { usuarioDeSesion } from './auth.middleware.mjs';

function leerCredenciales(body) {
  const email = String(body?.email ?? '').trim();
  const pass = String(body?.pass ?? '');
  return email && pass ? { email, pass } : null;
}

export async function iniciarSesion(req, res, next) {
  const credenciales = leerCredenciales(req.body);

  if (!credenciales) {
    return mostrarError(res, 400, 'El correo y la contraseña son obligatorios.');
  }

  try {
    const usuario = await buscarPorCorreo(credenciales.email);
    const passCorrecta =
      usuario && (await bcrypt.compare(credenciales.pass, usuario.pass_hash));

    // Mismo mensaje en ambos casos para no revelar qué correos están registrados.
    if (!passCorrecta) {
      return mostrarError(res, 401, 'Correo o contraseña incorrectos.');
    }

    const sessionId = nanoid();
    await guardarSesion(usuario.id, sessionId);

    const token = jwt.sign({ id: usuario.id, sessionId }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return mostrarSesionIniciada(res, token);
  } catch (error) {
    return next(error);
  }
}

export async function obtenerSesion(req, res, next) {
  try {
    const usuario = await usuarioDeSesion(req);
    if (!usuario) return mostrarSinSesion(res);

    return mostrarSesion(res, usuario);
  } catch (error) {
    return next(error);
  }
}

export async function cerrarSesion(req, res, next) {
  try {
    const usuario = await usuarioDeSesion(req);

    // Borrar el sessionId invalida el token aunque alguien conserve una copia.
    if (usuario) await guardarSesion(usuario.id, null);

    return mostrarSesionCerrada(res);
  } catch (error) {
    return next(error);
  }
}

export async function registrarse(req, res, next) {
  const credenciales = leerCredenciales(req.body);

  if (!credenciales) {
    return mostrarError(res, 400, 'El correo y la contraseña son obligatorios.');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const claveHasheada = await bcrypt.hash(credenciales.pass, salt);

    await insertarUsuario(credenciales.email, claveHasheada);

    return mostrarUsuarioCreado(res);
  } catch (error) {
    // 23505: violación de UNIQUE en PostgreSQL (el correo ya existe).
    if (error.code === '23505') {
      return mostrarError(res, 409, 'Ya existe un usuario con ese correo.');
    }
    return next(error);
  }
}
