const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

async function connectDB() {
  const connection = await pool.getConnection()
  console.log('MariaDB connecté')
  connection.release()
}

module.exports = { pool, connectDB };