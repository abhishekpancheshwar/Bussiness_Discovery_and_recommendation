const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addReview, getReviews } = require('../controllers/reviewController');
const router = express.Router();

// Add a review for a business
router.post('/add', protect, addReview);

// Get reviews for a specific business
router.get('/:businessId', getReviews);

module.exports = router;
