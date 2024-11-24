const express = require('express');
const { protect, verifyAdmin } = require('../middleware/authMiddleware');
const { adminOnly, createBusiness, updateBusiness } = require('../middleware/adminMiddleware');
const {
  getAllUsers,
  deleteUser,
  getAllBusinesses,
  deleteBusiness,
  getAllReviews,
  deleteReview,
} = require('../controllers/adminController');

const router = express.Router();

// User management
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:userId', protect, adminOnly, deleteUser);

// Business management
router.get('/businesses', protect, adminOnly, getAllBusinesses);
router.delete('/businesses/:businessId', protect, adminOnly, deleteBusiness);

// Review management
router.get('/reviews', protect, adminOnly, getAllReviews);
router.delete('/reviews/:reviewId', protect, adminOnly, deleteReview);

// CRUD endpoints for admin
router.post('/business', verifyAdmin, createBusiness);
router.put('/business/:id', verifyAdmin, updateBusiness);
router.delete('/business/:id', verifyAdmin, deleteBusiness);

module.exports = router;
