const db = require('../db');
const bcrypt = require('bcrypt');

// Listar todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, nombre, email, rol, club_id FROM usuarios ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT id, nombre, email, rol, club_id FROM usuarios WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear usuario (con contraseña encriptada)
const createUsuario = async (req, res) => {
  const { nombre, email, password, rol, club_id } = req.body;
  try {
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO usuarios (nombre, email, password, rol, club_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, rol, club_id',
      [nombre, email, hashedPassword, rol, club_id]
    );

    res.status(201).json({
      message: 'Usuario creado correctamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar usuario (si se envía password, se encripta)
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol, club_id } = req.body;

  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await db.query(
      'UPDATE usuarios SET nombre=$1, email=$2, password=COALESCE($3,password), rol=$4, club_id=$5 WHERE id=$6 RETURNING id, nombre, email, rol, club_id',
      [nombre, email, hashedPassword, rol, club_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario actualizado correctamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM usuarios WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};

