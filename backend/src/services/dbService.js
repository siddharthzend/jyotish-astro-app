import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

let pool = null;
const inMemoryStore = [];

/**
 * Initializes MySQL Database Connection and Tables
 */
export async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'jyotish_db';

  try {
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log(`✅ Connected to MySQL Database [${database}] on ${host}:${port}`);

    // Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_predictions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        contact VARCHAR(100) NOT NULL,
        dob VARCHAR(50) NOT NULL,
        tob VARCHAR(50) NOT NULL,
        pob VARCHAR(255) NOT NULL,
        timeframe VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        short_response TEXT NOT NULL,
        full_response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(createTableQuery);
    connection.release();
    return true;
  } catch (err) {
    console.warn(`⚠️ MySQL Connection Warning (${err.message}). Falling back to In-Memory DB Mode.`);
    pool = null;
    return false;
  }
}

/**
 * Saves prediction record to MySQL (or in-memory store)
 */
export async function savePrediction({ fullName, contact, dob, tob, pob, timeframe, category, shortResponse, fullResponse }) {
  const record = {
    full_name: fullName,
    contact,
    dob,
    tob,
    pob,
    timeframe,
    category,
    short_response: shortResponse,
    full_response: fullResponse,
    created_at: new Date()
  };

  if (pool) {
    try {
      const query = `
        INSERT INTO user_predictions (full_name, contact, dob, tob, pob, timeframe, category, short_response, full_response)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await pool.query(query, [fullName, contact, dob, tob, pob, timeframe, category, shortResponse, fullResponse]);
      record.id = result.insertId;
      return record;
    } catch (err) {
      console.error("Error saving to MySQL:", err.message);
    }
  }

  // Fallback to in-memory store
  record.id = inMemoryStore.length + 1;
  inMemoryStore.push(record);
  return record;
}

/**
 * Gets recent predictions list
 */
export async function getRecentPredictions(limit = 10) {
  if (pool) {
    try {
      const [rows] = await pool.query(`
        SELECT id, full_name, category, timeframe, short_response, created_at
        FROM user_predictions
        ORDER BY created_at DESC
        LIMIT ?
      `, [limit]);
      return rows;
    } catch (err) {
      console.error("Error fetching from MySQL:", err.message);
    }
  }

  return inMemoryStore.slice(-limit).reverse().map(r => ({
    id: r.id,
    full_name: r.full_name,
    category: r.category,
    timeframe: r.timeframe,
    short_response: r.short_response,
    created_at: r.created_at
  }));
}
