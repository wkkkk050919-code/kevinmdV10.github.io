const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase')
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function getDb() {
  const client = await pool.connect();
  return client;
}

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action_content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query('CREATE INDEX IF NOT EXISTS idx_records_user_id ON user_records(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_records_created ON user_records(created_at DESC)');

    console.log('数据库表初始化完成');
  } finally {
    client.release();
  }
}

async function queryAll(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

async function queryOne(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows.length > 0 ? result.rows[0] : null;
}

async function run(sql, params = [], returnCol = 'id') {
  const result = await pool.query(sql, params);
  return {
    lastInsertRowid: result.rows.length > 0 ? result.rows[0][returnCol] : null,
    changes: result.rowCount,
  };
}

module.exports = { getDb, initDb, queryAll, queryOne, run, pool };
