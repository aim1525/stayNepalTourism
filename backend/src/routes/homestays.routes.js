const express = require('express');
const router = express.Router();
const { getHomestays, getHomestayById, createHomestay, verifyHomestay } = require('../controllers/homestayController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.get('/', getHomestays);
router.get('/:id', getHomestayById);
router.post('/', verifyToken, requireRole('host', 'admin'), createHomestay);
router.patch('/:id/verify', verifyToken, requireRole('admin'), verifyHomestay);

module.exports = router;
