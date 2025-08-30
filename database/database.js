import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();

// Connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test connection
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.log('❌ Connection error', err.stack));

export default pool;

