// index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const db = require('./db');

const app = express();

// Conexión a la base de datos
db.connect()
  .then(() => console.log('✅ Base de datos conectada'))
  .catch(err => {
    console.error('❌ Error al conectar la base de datos:', err);
    process.exit(1); // Detener la app si no hay conexión
  });

// Middlewares
app.use(helmet()); // Seguridad básica
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

// Ruta raíz para probar
app.get('/', (req, res) => {
  res.send('API Padel Backend funcionando 🚀');
});

// Middleware para manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
