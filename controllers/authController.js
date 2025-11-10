const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Crear token
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, club_id: usuario.club_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };