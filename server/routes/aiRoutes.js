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

    const { role, difficulty } = req.body;

    const completion = await client.chat.completions.create({

      model: "deepseek-ai/DeepSeek-V3-0324",

      messages: [
        {
          role: "user",
          content: `
          Generate 5 interview questions for a ${role} role.

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
      questions
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