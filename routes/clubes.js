const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los clubes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clubes');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un club
router.post('/', async (req, res) => {
  const { nombre, direccion, contacto_nombre, contacto_telefono, logo_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clubes (nombre, direccion, contacto_nombre, contacto_telefono, logo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, direccion, contacto_nombre, contacto_telefono, logo_url]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;