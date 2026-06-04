const express = require("express");

const router = express.Router();

const Interview = require("../models/Interview");

router.get("/history", async (req, res) => {

  try {

    const interviews = await Interview.find()
      .sort({ createdAt: -1 });

    res.json(interviews);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch history"
    });

  }

});

module.exports = router;