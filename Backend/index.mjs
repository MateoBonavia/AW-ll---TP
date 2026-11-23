import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  CARPETA_DOCS,
  CARPETA_FRONTEND,
  CORS_ORIGENES,
  PUERTO,
} from './config.mjs';
import { responderError } from './modulos/respuestas.mjs';
import productosRouter from './modulos/productos/productos.rutas.mjs';
import ligasRouter from './modulos/ligas/ligas.rutas.mjs';
import authRouter from './modulos/auth/auth.rutas.mjs';

const app = express();

app.listen(PUERTO, () => console.log(`Servidor escuchando en puerto ${PUERTO}`));

app.use(express.json());
app.use(cookieParser());

// CORS: el sitio servido por este mismo servidor no lo necesita (mismo origen).
// Se habilita solo para los orígenes de desarrollo listados en CORS_ORIGENES
// (por ejemplo Live Server en el puerto 5500), con credentials para que el
// navegador envíe la cookie de sesión en esas peticiones.
app.use(cors({ origin: CORS_ORIGENES, credentials: true }));

app.use(express.static(CARPETA_FRONTEND));

// Documentación de la API (Scalar) y su especificación OpenAPI.
app.use('/api/v1/docs', express.static(CARPETA_DOCS));

app.use('/api/v1/productos', productosRouter);
app.use('/api/v1/ligas', ligasRouter);
app.use('/api/v1', authRouter); // /login, /logout, /sesion y /registrarse

// Cualquier otra ruta de la API responde con el mismo formato de error.
app.use('/api', (req, res) => responderError(res, 404, 'Ruta no encontrada.'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  responderError(res, 500, 'Error interno del servidor.');
});
