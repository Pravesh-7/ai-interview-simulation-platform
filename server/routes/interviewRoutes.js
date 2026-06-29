const express = require("express");

const router = express.Router();

const Interview = require("../models/Interview");
const authMiddleware = require("../middleware/authMiddleware");

// Get interview history of logged-in user
router.get("/history", authMiddleware, async (req, res) => {

  try {

    const interviews = await Interview.find({
      user: req.user.id
    }).sort({
      createdAt: -1
    });

    res.json(interviews);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to fetch history"
    });

  }

});

module.exports = router;