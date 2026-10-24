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
