const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const clubesRoutes = require('./routes/clubes');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

app.use('/clubes', clubesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);

// Ruta raíz para probar
app.get('/', (req, res) => {
  res.send('API Padel Backend funcionando 🚀');
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});