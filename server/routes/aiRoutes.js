const express = require("express");
const router = express.Router();

const OpenAI = require("openai");
const Interview = require("../models/Interview");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs are allowed"), false);
    }
  }
});

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

router.post(
  "/generate-from-resume",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      const { role, difficulty, questionCount = 5, focusArea } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No resume uploaded" });
      }

      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      const resumeText = data.text;

      const completion = await client.chat.completions.create({
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
          {
            role: "user",
            content: `
            Generate ${questionCount} interview questions for a ${role} role.
            Difficulty: ${difficulty}.
            
            Base the questions strictly on the following candidate's resume:
            ${resumeText}

            ${focusArea && focusArea !== "All" ? `CRITICAL INSTRUCTION: Focus your questions specifically on the candidate's ${focusArea}. Do not ask generic questions outside this focus area.` : ""}

            Only return questions.
`
          }
        ]
      });

      const questions = completion.choices[0].message.content;

      const interview = new Interview({
        user: req.user.id,
        role,
        difficulty,
        questions
      });

      await interview.save();

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.json({
        questions,
        interviewId: interview._id
      });

    } catch (err) {
      console.log("FULL ERROR:", err);
      fs.writeFileSync("error.log", err.stack || String(err));
      
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: "AI Generation from Resume Failed"
      });
    }
  }
);

module.exports = router;