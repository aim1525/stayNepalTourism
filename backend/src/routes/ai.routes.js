const express = require('express');
const router = express.Router();
const { getRecommendations, getModelComparisonMetrics } = require('../controllers/aiController');

router.get('/recommendations', getRecommendations);
router.get('/model-comparison', getModelComparisonMetrics);

module.exports = router;
