require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING,
});

async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_state (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      key TEXT NOT NULL,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, key)
    );
  `);
}

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Usuário e senha são obrigatórios." });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Usuário já existe." });
    }
    return res.status(500).json({ error: "Erro interno." });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Usuário e senha são obrigatórios." });
  }

  try {
    const result = await pool.query("SELECT id, username, password_hash FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }

    return res.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno." });
  }
});

app.get("/api/state/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const userResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const stateResult = await pool.query(
      "SELECT key, value FROM user_state WHERE user_id = $1",
      [user.id]
    );

    const state = {};
    stateResult.rows.forEach((row) => {
      state[row.key] = row.value;
    });

    return res.json({ state });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno." });
  }
});

app.post("/api/state/:username", async (req, res) => {
  const username = req.params.username;
  const { key, value } = req.body;

  if (!key) {
    return res.status(400).json({ error: "A chave é obrigatória." });
  }

  try {
    const userResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await pool.query(
      `INSERT INTO user_state (user_id, key, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [user.id, key, value]
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  await ensureTables();
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Erro ao iniciar o servidor:", error);
  process.exit(1);
});
