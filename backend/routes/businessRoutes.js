const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addBusiness, getBusinesses } = require('../controllers/businessController');
const { searchBusinesses, getRecommendations } = require('../controllers/businessController');
const router = express.Router();

// Route to add a new business (requires authentication)
router.post('/add', protect, addBusiness);

// Route to get all businesses (open to all)
router.get('/', getBusinesses);

// Search businesses
router.get('/search', searchBusinesses);

// Get business recommendations
router.get('/recommendations', getRecommendations);

module.exports = router;
