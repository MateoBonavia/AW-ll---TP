import express from 'express';
import cors from 'cors';

const port = 3000;

const app = express();

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));

app.use(express.json());
app.use(cors());

const URL_PRODUCTOS =
  'https://6aab1be4ea0e22daa6dbcb90.mockapi.io/api/productos';

app.get('/productos', async (req, res) => {
  const respuesta = await fetch(URL_PRODUCTOS);

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el catálogo de productos.');
  }

  res.status(200).json(await respuesta.json());
});

const URL_LIGAS = 'https://6aab1be4ea0e22daa6dbcb90.mockapi.io/api/liga';

app.get('/liga', async (req, res) => {
  const respuesta = await fetch(URL_LIGAS);

  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las ligas.');
  }

  const ligas = await respuesta.json();

  res.status(200).json(ligas);
});
