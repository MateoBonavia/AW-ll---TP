import pool from '../../conexion.bd.mjs';

export async function buscarPorCorreo(correo) {
  const resultado = await pool.query(
    'SELECT * FROM usuarios WHERE correo = $1',
    [correo]
  );

  return resultado.rows[0] ?? null;
}

export async function guardarSesion(id, sessionId) {
  await pool.query('UPDATE usuarios SET session_id = $1 WHERE id = $2', [
    sessionId,
    id,
  ]);
}

export async function buscarPorSesion(id, sessionId) {
  const resultado = await pool.query(
    'SELECT id, correo FROM usuarios WHERE id = $1 AND session_id = $2',
    [id, sessionId]
  );

  return resultado.rows[0] ?? null;
}

export async function insertarUsuario(correo, passHash) {
  await pool.query('INSERT INTO usuarios(correo, pass_hash) VALUES ($1, $2)', [
    correo,
    passHash,
  ]);
}
