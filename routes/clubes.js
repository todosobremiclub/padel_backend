const express = require('express');
const router = express.Router();
const {
  getClubes,
  getClubById,
  createClub,
  updateClub,
  deleteClub
} = require('../controllers/clubesController');

const verifyToken = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');

// Endpoints protegidos
router.get('/', verifyToken, allowRoles('SUPER_ADMIN', 'CLUB_ADMIN'), getClubes);
router.get('/:id', verifyToken, allowRoles('SUPER_ADMIN', 'CLUB_ADMIN'), getClubById);
router.post('/', verifyToken, allowRoles('SUPER_ADMIN'), createClub);
router.put('/:id', verifyToken, allowRoles('SUPER_ADMIN'), updateClub);
router.delete('/:id', verifyToken, allowRoles('SUPER_ADMIN'), deleteClub);

