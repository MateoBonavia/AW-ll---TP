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

const URL_PRODUCTOS =
  'https://6aab1be4ea0e22daa6dbcb90.mockapi.io/api/productos';

const URL_LIGAS = 'https://6aab1be4ea0e22daa6dbcb90.mockapi.io/api/liga';

/*
app.get('/productos', async (req, res) => {
  const respuesta = await fetch(URL_PRODUCTOS);

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el catálogo de productos.');
  }

  res.status(200).json(await respuesta.json());
});


app.get('/liga', async (req, res) => {
  const respuesta = await fetch(URL_LIGAS);

  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las ligas.');
  }

  const ligas = await respuesta.json();

  res.status(200).json(ligas);
});
*/

// Productos (Camisetas): las rutas se agrupan en su módulo MVC.
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
