require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    await pool.query(`
  CREATE TABLE IF NOT EXISTS "Transactions" (
    id SERIAL PRIMARY KEY,
    transactionId VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    amount INT,
    currency VARCHAR(10),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
  )
`);
    res.json({ message: "Postgres is running! Transactions ready" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// MoMo routes

app.post('/pay', async (req, res) => {
  try {
    const { phone, amount } = req.body;
    await pool.query("INSERT INTO transactions(phone, amount, status) VALUES($1,$2,'PENDING')", [phone, amount]);
    res.json({ success: true, message: `MoMo request sent to ${phone} for ${amount} UGX` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/transactions', async (req, res) => {
  const r = await pool.query("SELECT * FROM transactions ORDER BY id DESC");
  res.json(r.rows);
});
app.listen(port, '0.0.0.0', () => {
  console.log(`server is running on 0.0.0.0:${port}`);
});