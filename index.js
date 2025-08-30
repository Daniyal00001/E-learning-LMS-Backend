import express from "express";

const app = express();

import pool from './database/database.js';

async function startApp() {
  try {
    const result = await pool.query('SELECT NOW()');  // test query
    console.log('✅ Database connected at:', result.rows[0].now);
  } catch (err) {
    console.error('❌ Error connecting to DB:', err);
  }
}

startApp();


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
