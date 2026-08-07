const express = require('express');
const router = express.Router();
const { createReview, getHomestayReviews } = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createReview);
router.get('/homestay/:homestayId', getHomestayReviews);

module.exports = router;
