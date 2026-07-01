const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

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

  evaluation: {
    type: Object,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Interview", interviewSchema);