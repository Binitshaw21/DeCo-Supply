import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }
  
  dbInstance = await open({
    filename: path.join(process.cwd(), 'deco_supply.db'),
    driver: sqlite3.Database
  });

  // Create payments table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      payment_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      user_email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return dbInstance;
}
