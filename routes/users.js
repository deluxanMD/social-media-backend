const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Update user
router.put('/:id', async (req, res) => {
  const { userId, password, isAdmin } = req.body;
  const { id } = req.params;

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
      await User.findByIdAndUpdate(id, { $set: req.body });
      res.status(200).json('Account updated successfully');
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json('You can update only your account!');
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const { userId, isAdmin } = req.body;
  const { id } = req.params;

  if (userId === id || isAdmin) {
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json('Account deleted successfully');
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json('You can delete only your account!');
  }
});

// Get user

// Follow user

// Unfollow user

module.exports = router;
