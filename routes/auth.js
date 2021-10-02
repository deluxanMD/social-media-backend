const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Generate salt for password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json('Something went wrong');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check user exist or not
    const user = await User.findOne({ email });
    !user && res.status(404).json('User not found');

    // Compare the bcrypt password with user input
    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(404).json('Wrong password');
  } catch (error) {
    res.status(500).json('Something went wrong');
  }
});

module.exports = router;
