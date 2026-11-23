import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Carpeta de este archivo: las rutas no dependen de dónde se ejecute `node`.
const CARPETA_BACKEND = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(CARPETA_BACKEND, '.env'), quiet: true });

// Sin clave secreta no se pueden firmar tokens: se corta el arranque con un aviso claro.
if (!process.env.JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET (ver .env.example).');
}

export const PUERTO = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET;

// Orígenes externos autorizados por CORS, separados por coma (ver index.mjs).
export const CORS_ORIGENES = (process.env.CORS_ORIGENES || 'http://localhost:5500')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

// En producción (HTTPS) la cookie de sesión solo viaja por conexiones seguras.
export const COOKIE_SEGURA = process.env.NODE_ENV === 'production';

export const BD = {
  host: process.env.BD_HOST || 'localhost',
  user: process.env.BD_USER,
  password: process.env.BD_PASS,
  database: process.env.BD_BD,
  port: process.env.BD_PORT,
};

// Archivos estáticos que sirve Express.
export const CARPETA_FRONTEND = path.join(CARPETA_BACKEND, '../Frontend');

// Todas las imágenes de productos (las iniciales y las subidas) viven en esta carpeta.
export const CARPETA_IMAGENES = path.join(CARPETA_FRONTEND, 'recursos/Camisetas');

// Prefijo con el que el Front-End accede a esa carpeta.
export const URL_IMAGENES = './recursos/Camisetas';

// Documentación de la API (Scalar + OpenAPI).
export const CARPETA_DOCS = path.join(CARPETA_BACKEND, 'docs');
