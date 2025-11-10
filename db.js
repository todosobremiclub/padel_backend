const { Pool } = require('pg');
require('dotenv').config();

// Configuración del pool de conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones seguras en Render
  }
});

// Exportar función para consultas
module.exports = {
  query: (text, params) => pool.query(text, params)
};
