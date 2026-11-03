import pool from '../../conexion.bd.mjs';

export async function buscarTodas() {
  const resultado = await pool.query('SELECT * FROM ligas ORDER BY id');

  return resultado.rows;
}
