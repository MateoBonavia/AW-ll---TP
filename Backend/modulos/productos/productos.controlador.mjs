import {
  buscarPorId,
  buscarTodos,
  insertarProducto,
  borrarPorId,
  actualizarPorId,
} from './productos.modelo.mjs';
import {
  mostrarError,
  mostrarProducto,
  mostrarProductoCreado,
  mostrarProductos,
  mostrarProductoEliminado,
} from './productos.vista.mjs';
import {
  borrarImagenes,
  rutasDeImagenes,
  subirImagenes,
} from './productos.imagenes.mjs';

function leerId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
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

    const imagenesSubidas = rutasDeImagenes(req);
    const { nombre, descripcion, precio, etiqueta, anio, liga_id, talles, tags } =
      req.body ?? {};

    const nombreLimpio = String(nombre ?? '').trim();

    if (!nombreLimpio) {
      await borrarImagenes(imagenesSubidas);
      return mostrarError(res, 400, 'El nombre es obligatorio.');
    }

    if (precio === undefined || precio === '' || !(Number(precio) >= 0)) {
      await borrarImagenes(imagenesSubidas);
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
        imagenes: imagenesSubidas,
        talles: [].concat(talles ?? []),
        tags: String(tags ?? '')
          .split(',')
          .map((tag) => tag.trim().toUpperCase())
          .filter(Boolean),
      });

      return mostrarProductoCreado(res, producto);
    } catch (errorBD) {
      // El producto no se guardó: sus imágenes no deben quedar huérfanas en disco.
      console.error(errorBD);
      await borrarImagenes(imagenesSubidas);
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

    // Con el producto fuera de la BD, se borran también sus imágenes del disco.
    await borrarImagenes(eliminado.imagenes);

    return mostrarProductoEliminado(res, eliminado);
  } catch (error) {
    return next(error);
  }
}

export function actualizarProducto(req, res) {
  subirImagenes(req, res, async (error) => {
    if (error) {
      return mostrarError(res, 400, 'No se pudieron subir las imágenes.');
    }

    const imagenesSubidas = rutasDeImagenes(req);
    const id = leerId(req.params.id);

    if (id === null) {
      await borrarImagenes(imagenesSubidas);
      return mostrarError(res, 400, 'El id debe ser un número entero positivo.');
    }

    try {
      const actual = await buscarPorId(id);

      if (!actual.length) {
        await borrarImagenes(imagenesSubidas);
        return mostrarError(
          res,
          404,
          'No se encontró un producto con el id ingresado.'
        );
      }

      const datos = req.body ?? {};
      const nombre = String(datos.nombre ?? '').trim();

      if (!nombre || !(Number(datos.precio) >= 0)) {
        await borrarImagenes(imagenesSubidas);
        return mostrarError(res, 400, 'Los datos enviados son inválidos.');
      }

      const reemplazaImagenes = imagenesSubidas.length > 0;

      const producto = await actualizarPorId(id, {
        nombre,
        descripcion: datos.descripcion ?? '',
        precio: Number(datos.precio),
        etiqueta: datos.etiqueta || null,
        anio: datos.anio || datos['año'] || actual[0]['año'],
        liga_id: datos.liga_id || actual[0].liga_id,
        imagenes: reemplazaImagenes ? imagenesSubidas : actual[0].imagenes,
      });

      // Las imágenes reemplazadas ya no las usa ningún producto.
      if (reemplazaImagenes) await borrarImagenes(actual[0].imagenes);

      return mostrarProducto(res, producto);
    } catch (errorBD) {
      console.error(errorBD);
      await borrarImagenes(imagenesSubidas);
      return mostrarError(res, 500, 'No se pudo actualizar el producto.');
    }
  });
}
