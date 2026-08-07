const express = require('express');
const router = express.Router();
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/initiate', verifyToken, initiatePayment);
router.post('/verify', verifyPayment);

module.exports = router;
