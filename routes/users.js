const router = require('express').Router();
const bcrypt = require('bcrypt');
const { json } = require('express');
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
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    const { password, createdAt, updatedAt, ...props } = user._doc;
    res.status(200).json(props);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Follow user
router.put('/:id/follow', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== id) {
    try {
      const targetUser = await User.findById(id);
      const currentUser = await User.findById(userId);
      if (!targetUser.followers.includes(userId)) {
        await targetUser.updateOne({ $push: { followers: userId } });
        await currentUser.updateOne({ $push: { followings: id } });
        res.status(200).json('User has been followed');
      } else {
        res.status(403).json('You already follow this user');
      }
    } catch (error) {}
  } else {
    res.status(403).json('You cannot follow yourself');
  }
});

// Unfollow user
router.put('/:id/unfollow', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== id) {
    try {
      const targetUser = await User.findById(id);
      const currentUser = await User.findById(userId);
      if (targetUser.followers.includes(userId)) {
        await targetUser.updateOne({ $pull: { followers: userId } });
        await currentUser.updateOne({ $pull: { followings: id } });
        res.status(200).json('User has been unfollowed');
      } else {
        res.status(403).json('You are not following this user');
      }
    } catch (error) {}
  } else {
    res.status(403).json('You cannot unfollow yourself');
  }
});

module.exports = router;
