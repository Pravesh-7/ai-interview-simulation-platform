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

// Delete a single interview
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.json({ message: "Interview deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete interview" });
  }
});

// Delete all interviews for user
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await Interview.deleteMany({ user: req.user.id });
    res.json({ message: "All interviews deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete all interviews" });
  }
});

module.exports = router;