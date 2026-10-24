import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './conexion.bd.mjs';
import productosRouter from './modulos/productos/productos.rutas.mjs';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));

app.use(express.json());
app.use(cors());
app.use(express.static('../Frontend'));

// Productos.
app.use('/api/v1/productos', productosRouter);

// Ligas
app.get('/api/v1/ligas', async (req, res) => {
  const respuesta = await pool.query('SELECT * FROM Ligas');
  res.status(200).json(respuesta.rows);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
