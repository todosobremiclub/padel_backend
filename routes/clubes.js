const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const {
  getClubes,
  getClubById,
  createClub,
  updateClub,
  deleteClub
} = require('../controllers/clubesController');

// Endpoints protegidos
router.get('/', verifyToken, allowRoles('SuperAdmin', 'ClubAdmin'), getClubes);
router.get('/:id', verifyToken, allowRoles('SuperAdmin', 'ClubAdmin'), getClubById);
router.post('/', verifyToken, allowRoles('SuperAdmin'), createClub);
router.put('/:id', verifyToken, allowRoles('SuperAdmin'), updateClub);
router.delete('/:id', verifyToken, allowRoles('SuperAdmin'), deleteClub);

module.exports = router;
