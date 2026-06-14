import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
// Uses variables from .env or default values corresponding to the proposed docker-compose
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'dietcoach',
});

pool.on('error', (err) => {
  console.error('Unexpected error on PostgreSQL pool:', err);
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
