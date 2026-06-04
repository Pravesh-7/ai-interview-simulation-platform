const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({

  role: {
    type: String,
    required: true
  },

  difficulty: {
    type: String,
    required: true
  },

  questions: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Interview", interviewSchema);