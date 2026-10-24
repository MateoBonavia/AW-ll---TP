import path from 'path';
import multer from 'multer';
import {
  buscarPorId,
  buscarTodos,
  insertarProducto,
  borrarPorId,
  actualizarPorId
} from './productos.modelo.mjs';
import {
  mostrarError,
  mostrarProducto,
  mostrarProductoCreado,
  mostrarProductos,
  mostrarProductoEliminado
} from './productos.vista.mjs';

function leerId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

const subirImagenes = multer({
  dest: path.resolve('../Frontend/recursos/subidas'),
}).array('imagenes', 5);

function rutasDeImagenes(req) {
  return (req.files ?? []).map(
    (archivo) => `./recursos/subidas/${archivo.filename}`
  );
}

export async function obtenerProductos(req, res, next) {
  try {
    const productos = await buscarTodos();
    return mostrarProductos(res, productos);
  } catch (error) {
    return next(error);
  }
}

export async function obtenerProductoPorId(req, res, next) {
  const id = leerId(req.params.id);

  if (id === null) {
    return mostrarError(res, 400, 'El id debe ser un número entero positivo.');
  }

  try {
    const productos = await buscarPorId(id);

    if (productos.length === 0) {
      return mostrarError(
        res,
        404,
        'No se encontró un producto con el id ingresado.'
      );
    }

    return mostrarProducto(res, productos[0]);
  } catch (error) {
    return next(error);
  }
}

export function crearProducto(req, res) {
  subirImagenes(req, res, async (error) => {
    if (error) {
      return mostrarError(res, 400, 'No se pudieron subir las imágenes.');
    }

    const { nombre, descripcion, precio, etiqueta, anio, liga_id } =
      req.body ?? {};

    const nombreLimpio = String(nombre ?? '').trim();

    if (!nombreLimpio) {
      return mostrarError(res, 400, 'El nombre es obligatorio.');
    }

    if (precio === undefined || precio === '' || !(Number(precio) >= 0)) {
      return mostrarError(
        res,
        400,
        'El precio debe ser un número mayor o igual a 0.'
      );
    }

    try {
      const producto = await insertarProducto({
        nombre: nombreLimpio,
        descripcion: descripcion ?? '',
        precio: Number(precio),
        etiqueta: etiqueta || null,
        anio: anio || null,
        liga_id: liga_id || null,
        imagenes: rutasDeImagenes(req),
      });

      return mostrarProductoCreado(res, producto);
    } catch (errorBD) {
      console.log(errorBD);
      return mostrarError(res, 500, 'No se pudo guardar el producto.');
    }
  });
}


export async function eliminarProducto(req, res, next) {
  const id = leerId(req.params.id);

  if (id === null) {
    return mostrarError(res, 400, 'El id debe ser un número entero positivo.');
  }

  try {
    const eliminado = await borrarPorId(id);

    if (!eliminado) {
      return mostrarError(
        res,
        404,
        'No se encontró un producto con el id ingresado.'
      );
    }

    return mostrarProductoEliminado(res);
  } catch (error) {
    return next(error);
  }
}

export function actualizarProducto(req, res) {
  subirImagenes(req, res, async (error) => {
    if (error) return mostrarError(res, 400, 'No se pudieron subir las imágenes.');
    const id = leerId(req.params.id);
    if (id === null) return mostrarError(res, 400, 'El id debe ser un número entero positivo.');
    const actual = await buscarPorId(id);
    if (!actual.length) return mostrarError(res, 404, 'No se encontró un producto con el id ingresado.');
    const datos = req.body ?? {};
    const nombre = String(datos.nombre ?? '').trim();
    if (!nombre || !(Number(datos.precio) >= 0)) return mostrarError(res, 400, 'Los datos enviados son inválidos.');
    try {
      const producto = await actualizarPorId(id, {
        nombre, descripcion: datos.descripcion ?? '', precio: Number(datos.precio), etiqueta: datos.etiqueta || null,
        anio: datos.anio || datos['año'] || actual[0]['año'],
        liga_id: datos.liga_id || actual[0].liga_id,
        imagenes: req.files?.length ? rutasDeImagenes(req) : actual[0].imagenes,
      });
      return mostrarProducto(res, producto);
    } catch (errorBD) { return mostrarError(res, 500, 'No se pudo actualizar el producto.'); }
  });
}
