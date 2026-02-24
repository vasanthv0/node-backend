// const { Pool } = require("pg");

// const pool = new Pool({
// <<<<<<< HEAD
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
// =======
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
//   // connectionString: process.env.DATABASE_URL,
//   //   ssl: {
//   //   rejectUnauthorized: false
//   // }
  
// >>>>>>> 78506cc (Updated project with latest changes)
// });
// console.log("DB URL:", process.env.DATABASE_URL);

// pool
//   .connect()
//   .then(() => console.log("✅ Database connected using DATABASE_URL"))
//   .catch(err => console.error("❌ DB connection error:", err));

// module.exports = pool;
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