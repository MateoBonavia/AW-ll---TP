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
        (nombre, descripcion, precio, etiqueta, anio, liga_id, imagenes, talles, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      producto.talles,
      producto.tags,
    ]
  );

  return resultado.rows[0];
}

export async function borrarPorId(id) {
  const resultado = await pool.query('DELETE FROM productos WHERE id = $1', [id]);

  return resultado.rowCount > 0; // Si el id no existe, devolvemos false.
}