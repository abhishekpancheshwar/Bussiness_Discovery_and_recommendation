const Business = require("../models/Business");
const User = require("../models/User");

// Add a new business
exports.addBusiness = async (req, res) => {
  try {
    const { name, description, category, location, coordinates, images } =
      req.body;

    if (req.user.role !== "business_owner") {
      return res
        .status(403)
        .json({ message: "Only business owners can add businesses." });
    }

    const business = new Business({
      name,
      description,
      category,
      location,
      coordinates,
      images,
      owner: req.user._id,
    });

    await business.save();
    res.status(201).json({ message: "Business added successfully!", business });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding business", error: err.message });
  }
};

// Get all businesses
exports.getBusinesses = async (req, res) => {
  
  try {
    const { category, location } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = location;

    const businesses = await Business.find(filter).populate(
      "owner",
      "name email"
    );
    res.status(200).json(businesses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching businesses", error: err.message });
  }
};

exports.searchBusinesses = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const businesses = await Business.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search
        { category: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ],
    });

    if (businesses.length === 0) {
      return res
        .status(404)
        .json({ message: "No businesses found matching your query" });
    }

    res.status(200).json(businesses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error performing search", error: err.message });
  }
};

// Recommend businesses based on location or category
exports.getRecommendations = async (req, res) => {
  try {
    const { category, location } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = location;

    const recommendations = await Business.find(filter)
      .sort({ averageRating: -1 })
      .limit(10);

    if (recommendations.length === 0) {
      return res
        .status(404)
        .json({ message: "No recommendations found for the given filters" });
    }

    res.status(200).json(recommendations);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching recommendations", error: err.message });
  }
};
