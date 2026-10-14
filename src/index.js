const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Transactions" (
        id SERIAL PRIMARY KEY,
        amount INT
      )
    `);
    res.json({ message: "Postgres is running! Transactions ready" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});