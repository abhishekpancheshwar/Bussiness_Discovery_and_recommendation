const Business = require('../models/Business');

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Create a new business
exports.createBusiness = async (req, res) => {
  try {
    const business = new Business(req.body);
    await business.save();
    res
      .status(201)
      .json({ message: "Business created successfully", business });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating business", error: err.message });
  }
};

// Update a business
exports.updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res
      .status(200)
      .json({ message: "Business updated successfully", business });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating business", error: err.message });
  }
};

// Delete a business
exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findByIdAndDelete(id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json({ message: "Business deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting business", error: err.message });
  }
};
