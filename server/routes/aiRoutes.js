const express = require("express");
const router = express.Router();

const OpenAI = require("openai");
const Interview = require("../models/Interview");
const authMiddleware = require("../middleware/authMiddleware");

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

router.post(
  "/generate",
  authMiddleware,
  async (req, res) => {

  try {

    const { role, difficulty, questionCount = 5 } = req.body;

    const completion = await client.chat.completions.create({

      model: "deepseek-ai/DeepSeek-V3-0324",

      messages: [
        {
          role: "user",
          content: `
          Generate ${questionCount} interview questions for a ${role} role.

          Difficulty: ${difficulty}.

          Only return questions.
`       }
      ]

    });

    const questions = completion.choices[0].message.content;

    // ✅ Save interview to MongoDB
    const interview = new Interview({
      user: req.user.id,
      role,
      difficulty,
      questions
    });

    await interview.save();

    // ✅ Send response
    res.json({
      questions,
      interviewId: interview._id
    });

  } catch (err) {

    console.log("FULL ERROR:");
    console.log(err);

    res.status(500).json({
      message: "AI Generation Failed"
    });

  }

});

module.exports = router;