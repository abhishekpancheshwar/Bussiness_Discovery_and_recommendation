const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(name, email, password, req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully' });
    console.log('Response being sent:', { message: 'Registration successful' });
  } catch (error) {
    console.log("An error occurred in the registration");
    
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    console.log("data", email, password);
    
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.log("error", err);
    
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
