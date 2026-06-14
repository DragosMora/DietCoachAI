import fs from 'fs';
import path from 'path';
import pool from './db';

export async function initializeDatabase() {
  const schemaPath = path.join(__dirname, '../src/schema.sql');
  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    let retries = 5;
    while (retries > 0) {
      try {
        await pool.query(schemaSql);
        console.log('PostgreSQL database schema initialized successfully!');
        return;
      } catch (error: any) {
        retries--;
        console.error(`Failed to initialize database schema (retries left: ${retries}):`, error.message);
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Critical database initialization failure:', error);
  }
}
