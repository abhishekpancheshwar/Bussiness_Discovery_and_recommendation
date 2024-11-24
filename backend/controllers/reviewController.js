const Review = require('../models/Review');
const Business = require('../models/Business');

// Add a review for a business
exports.addReview = async (req, res) => {
  try {
    const { businessId, rating, comment } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check if user already reviewed this business
    const existingReview = await Review.findOne({ business: businessId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this business' });
    }

    const review = new Review({
      business: businessId,
      user: req.user._id,
      rating,
      comment,
    });

    await review.save();

    // Update business average rating
    const reviews = await Review.find({ business: businessId });
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    business.averageRating = averageRating.toFixed(1);
    await business.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    res.status(500).json({ message: 'Error adding review', error: err.message });
  }
};

// Get reviews for a business
exports.getReviews = async (req, res) => {
  try {
    const { businessId } = req.params;

    const reviews = await Review.find({ business: businessId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this business' });
    }

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
};
