const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const db = require('./db'); // Conexión PostgreSQL

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Archivos estáticos (CSS, imágenes)

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', './views'); // Carpeta donde estarán las plantillas

// Rutas API
const clubesRoutes = require('./routes/clubes');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

app.use('/clubes', clubesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);

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

// Ruta dinámica para mostrar la página del club
app.get('/club/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM clubes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Club no encontrado');
    }
    res.render('club', { club: result.rows[0] }); // Renderiza la vista con datos del club
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar el club');
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

