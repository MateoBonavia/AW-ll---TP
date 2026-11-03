import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CARPETA_FRONTEND, PUERTO } from './config.mjs';
import { responderError } from './modulos/respuestas.mjs';
import productosRouter from './modulos/productos/productos.rutas.mjs';
import ligasRouter from './modulos/ligas/ligas.rutas.mjs';
import authRouter from './modulos/auth/auth.rutas.mjs';

const app = express();

app.listen(PUERTO, () => console.log(`Servidor escuchando en puerto ${PUERTO}`));

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static(CARPETA_FRONTEND));

app.use('/api/v1/productos', productosRouter);
app.use('/api/v1/ligas', ligasRouter);
app.use('/api/v1', authRouter); // /login, /sesion y /registrarse

app.use((err, req, res, next) => {
  console.error(err.stack);
  responderError(res, 500, err.message);
});
