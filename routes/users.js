const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Update user
router.put('/:id', async (req, res) => {
  const { userId, password } = req.body;
  const { id } = req.params;
  const existingUser = await User.findOne({ _id: id });
  const { isAdmin } = existingUser;

  if (userId === id || isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      } catch (error) {
        return res.status(500).json('Something error!!');
      }
    }
    try {
      const user = await User.findByIdAndUpdate(id, { $set: req.body });
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json('You cn update only your account!');
  }
});

// Delete user

// Get user

// Follow user

// Unfollow user

module.exports = router;
