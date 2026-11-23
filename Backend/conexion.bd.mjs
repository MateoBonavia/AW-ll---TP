import { Pool } from 'pg';
import { BD } from './config.mjs';

const pool = new Pool(BD);

export default pool;
