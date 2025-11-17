const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Listar usuarios con club asignado
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT usuarios.id, usuarios.email, usuarios.nombre, clubes.nombre AS club
      FROM usuarios
      LEFT JOIN clubes ON usuarios.club_id = clubes.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Editar usuario (incluye cambio de contraseña)
router.put('/:id', async (req, res) => {
  const { nombre, email, club_id, password } = req.body;
  try {
    let query = 'UPDATE usuarios SET nombre=$1, email=$2, club_id=$3';
    let params = [nombre, email, club_id, req.params.id];
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query += ', password=$4 WHERE id=$5';
      params = [nombre, email, club_id, hashed, req.params.id];
    } else {
      query += ' WHERE id=$4';
    }
    await db.query(query, params);
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM usuarios WHERE id=$1', [req.params.id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
