const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar clubes
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clubes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clubes' });
  }
});

// Obtener un club por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clubes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Club no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el club' });
  }
});

// Editar club
router.put('/:id', async (req, res) => {
  const { nombre, direccion, contacto_nombre, contacto_telefono, logo_url, descripcion } = req.body;
  try {
    await db.query(
      'UPDATE clubes SET nombre=$1, direccion=$2, contacto_nombre=$3, contacto_telefono=$4, logo_url=$5, descripcion=$6 WHERE id=$7',
      [nombre, direccion, contacto_nombre, contacto_telefono, logo_url, descripcion, req.params.id]
    );
    res.json({ message: 'Club actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar club' });
  }
});

// Eliminar club
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM clubes WHERE id=$1', [req.params.id]);
    res.json({ message: 'Club eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar club' });
  }
});

module.exports = router;
