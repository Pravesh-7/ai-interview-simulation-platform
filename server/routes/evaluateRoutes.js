const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const Interview = require("../models/Interview");
const authMiddleware = require("../middleware/authMiddleware");

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { questions, answers, interviewId } = req.body;

    const prompt = `
You are an experienced technical interviewer.

Interview Questions:
${questions}

Candidate Answers:
${answers}

Evaluate the candidate's answers based on the questions provided.

You MUST return ONLY a valid, raw JSON object (without any markdown formatting like \`\`\`json) with the exact following structure:
{
  "overallScore": number (out of 100),
  "technicalKnowledge": number (out of 10),
  "communication": number (out of 10),
  "confidence": number (out of 10),
  "problemSolving": number (out of 10),
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "areasOfImprovement": ["string", "string"]
}
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

    let content = completion.choices[0].message.content.trim();
    if (content.startsWith("\`\`\`json")) {
      content = content.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    }
    
    const evaluationData = JSON.parse(content);

    if (interviewId) {
      await Interview.findOneAndUpdate(
        { _id: interviewId, user: req.user.id },
        { evaluation: evaluationData }
      );
    }

    res.json({
      feedback: evaluationData,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Evaluation Failed",
    });
  }
});

module.exports = router;