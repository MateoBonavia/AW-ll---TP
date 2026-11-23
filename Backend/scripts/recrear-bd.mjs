// Recrea la base de datos ejecutando postgre-sql/tienda.sql con las credenciales del .env.
// Uso: pnpm bd:recrear (con el contenedor de PostgreSQL en ejecución).
import fs from 'fs/promises';
import pool from '../conexion.bd.mjs';

const archivoSql = new URL('../postgre-sql/tienda.sql', import.meta.url);

try {
  const sql = (await fs.readFile(archivoSql, 'utf8'))
    .split('\n')
    // Los comandos de psql (como \c tienda) no son SQL: la conexión ya apunta a BD_BD.
    .filter((linea) => !linea.trim().startsWith('\\'))
    .join('\n');

  await pool.query(sql);
  console.log('Base de datos recreada correctamente.');
} catch (error) {
  console.error('No se pudo recrear la base de datos:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
