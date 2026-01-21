const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool
  .connect()
  .then(() => console.log("✅ Database connected using DATABASE_URL"))
  .catch(err => console.error("❌ DB connection error:", err));

module.exports = pool;
