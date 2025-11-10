// index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const db = require('./db'); // Aquí tienes acceso a db.query

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas
const clubesRoutes = require('./routes/clubes');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

app.use('/clubes', clubesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);
app.use(express.static('public'));

// Ruta raíz para probar conexión a DB
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()'); // Test rápido
    res.send(`API Padel Backend funcionando 🚀 | DB OK: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error conectando a la base de datos');
  }
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

