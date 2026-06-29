const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

router.post("/", async (req, res) => {
  try {
    const { questions, answers } = req.body;

    const prompt = `
You are an experienced technical interviewer.

Interview Questions:
${questions}

Candidate Answers:
${answers}

Evaluate the answers.

Return ONLY:

Overall Score: __/10

For each question:
- Score
- Strengths
- Improvements
- Correct Answer (short)

Finally give:
Overall Feedback
`;

    const completion = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      feedback: completion.choices[0].message.content,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Evaluation Failed",
    });
  }
});

module.exports = router;