const db = require('../db');

// Obtener todos los clubes
const getClubes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clubes ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo clubes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener un club por ID
const getClubById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM clubes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Club no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo club:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un club
const createClub = async (req, res) => {
  const { nombre, direccion, contacto_nombre, contacto_telefono, logo_url } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO clubes (nombre, direccion, contacto_nombre, contacto_telefono, logo_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, direccion, contacto_nombre, contacto_telefono, logo_url]
    );
    res.status(201).json({
      message: 'Club creado correctamente',
      club: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando club:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar un club
const updateClub = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, contacto_nombre, contacto_telefono, logo_url } = req.body;
  try {
    const result = await db.query(
      `UPDATE clubes
       SET nombre=$1, direccion=$2, contacto_nombre=$3, contacto_telefono=$4, logo_url=$5
       WHERE id=$6 RETURNING *`,
      [nombre, direccion, contacto_nombre, contacto_telefono, logo_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Club no encontrado' });
    }
    res.json({
      message: 'Club actualizado correctamente',
      club: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando club:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un club
const deleteClub = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM clubes WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Club no encontrado' });
    }
    res.json({ message: 'Club eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando club:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


