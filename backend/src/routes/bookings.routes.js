const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, updateBookingStatus } = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createBooking);
router.get('/', verifyToken, getUserBookings);
router.patch('/:id/status', verifyToken, updateBookingStatus);

module.exports = router;
