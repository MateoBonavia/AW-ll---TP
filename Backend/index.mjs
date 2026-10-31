import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './conexion.bd.mjs';
import productosRouter from './modulos/productos/productos.rutas.mjs';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static('../Frontend'));

// Productos.
app.use('/api/v1/productos', productosRouter);

// Ligas
app.get('/api/v1/ligas', async (req, res) => {
  const respuesta = await pool.query('SELECT * FROM Ligas');
  res.status(200).json(respuesta.rows);
});

// Auth
app.post('/api/v1/login', async (req, res) => {
  const { email, pass } = req.body;

  try {
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [email]
    );

    if (resultado.rows.length == 0) return;

    const existe = await bcrypt.compare(pass, resultado.rows[0].pass_hash);

    if (existe) {
      const sessionId = nanoid();

      await pool.query('UPDATE usuarios SET session_id = $1 WHERE id = $2', [
        sessionId,
        resultado.rows[0].id,
      ]);

      const token = jwt.sign(
        { id: resultado.rows[0].id, sessionId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ message: 'Sesión iniciada' });
    }
  } catch (e) {
    res.status(400).json({
      message: 'Error al iniciar sesión',
    });
  }
});

app.get('/api/v1/sesion', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(400).json({ autenticado: false });

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    const resultado = await pool.query(
      'SELECT id, correo FROM usuarios WHERE id = $1 AND session_id = $2',
      [datos.id, datos.sessionId]
    );

    if (resultado.rows.length === 0) {
      return res.status(400).json({ autenticado: false });
    }

    return res.json({ autenticado: true, usuario: resultado.rows[0] });
  } catch {
    return res.status(400).json({ autenticado: false });
  }
});

app.post('/api/v1/registrarse', async (req, res) => {
  const { email, pass } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const clave_hasheada = await bcrypt.hash(pass, salt);

    const resultado = await pool.query(
      'INSERT INTO usuarios(correo, pass_hash) VALUES ($1, $2)',
      [email, clave_hasheada]
    );

    res.status(200).json({
      message: 'Usuario creado correctamente',
    });
  } catch (e) {}
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
