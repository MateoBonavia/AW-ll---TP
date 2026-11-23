import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { CARPETA_IMAGENES, URL_IMAGENES } from '../../config.mjs';

// Guarda cada archivo con un nombre único, conservando su extensión.
const almacenamiento = multer.diskStorage({
  destination: CARPETA_IMAGENES,
  filename: (req, archivo, cb) =>
    cb(null, `${nanoid()}${path.extname(archivo.originalname).toLowerCase()}`),
});

export const subirImagenes = multer({ storage: almacenamiento }).array(
  'imagenes',
  5
);

// Rutas públicas de las imágenes recién subidas, tal como se guardan en la BD.
export function rutasDeImagenes(req) {
  return (req.files ?? []).map(
    (archivo) => `${URL_IMAGENES}/${archivo.filename}`
  );
}

// Borra del disco las imágenes indicadas por su ruta pública.
export async function borrarImagenes(rutas = []) {
  await Promise.all(
    rutas.map(async (ruta) => {
      if (!ruta.startsWith(`${URL_IMAGENES}/`)) return;

      const archivo = path.resolve(
        CARPETA_IMAGENES,
        ruta.slice(URL_IMAGENES.length + 1)
      );

      // Nunca se borra nada fuera de la carpeta de imágenes.
      if (!archivo.startsWith(CARPETA_IMAGENES + path.sep)) return;

      try {
        await fs.rm(archivo, { force: true });
      } catch (error) {
        // Si un archivo no se puede borrar, la operación sobre el producto sigue siendo válida.
        console.error(`No se pudo borrar la imagen ${archivo}:`, error.message);
      }
    })
  );
}
