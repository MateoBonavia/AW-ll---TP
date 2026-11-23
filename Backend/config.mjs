import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Carpeta de este archivo: las rutas no dependen de dónde se ejecute `node`.
const CARPETA_BACKEND = path.dirname(fileURLToPath(import.meta.url));

export const PUERTO = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET;

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
