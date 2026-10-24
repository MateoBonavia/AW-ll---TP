import pool from '../../conexion.bd.mjs';

const CAMPOS_PRODUCTO = `
  id,
  nombre,
  descripcion,
  precio::float8 AS precio,
  etiqueta,
  anio AS "año",
  liga_id,
  imagenes,
  talles,
  tags
`;

export async function buscarTodos() {
  const resultado = await pool.query(`
    SELECT ${CAMPOS_PRODUCTO}
    FROM productos
    ORDER BY id
  `);

  return resultado.rows;
}

export async function buscarPorId(id) {
  const resultado = await pool.query(
    `
      SELECT ${CAMPOS_PRODUCTO}
      FROM productos
      WHERE id = $1
    `,
    [id]
  );

  return resultado.rows;
}

export async function insertarProducto(producto) {
  const resultado = await pool.query(
    `
      INSERT INTO productos
        (nombre, descripcion, precio, etiqueta, anio, liga_id, imagenes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING ${CAMPOS_PRODUCTO}
    `,
    [
      producto.nombre,
      producto.descripcion,
      producto.precio,
      producto.etiqueta,
      producto.anio,
      producto.liga_id,
      producto.imagenes,
    ]
  );

  return resultado.rows[0];
}

export async function borrarPorId(id) {
  const resultado = await pool.query('DELETE FROM productos WHERE id = $1', [id]);

  return resultado.rowCount > 0; // Si el id no existe, devolvemos false.
}

export async function actualizarPorId(id, producto) {
  const resultado = await pool.query(`UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, etiqueta=$4, anio=$5, liga_id=$6, imagenes=$7 WHERE id=$8 RETURNING ${CAMPOS_PRODUCTO}`, [producto.nombre, producto.descripcion, producto.precio, producto.etiqueta, producto.anio, producto.liga_id, producto.imagenes, id]);
  return resultado.rows[0];
}
