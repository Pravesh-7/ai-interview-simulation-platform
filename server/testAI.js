/* 
 * NOTE: This is an unused scratch file previously used for testing the Google Gemini SDK. 
 * The actual application routes (aiRoutes.js, evaluateRoutes.js) use the OpenAI SDK 
 * pointed at HuggingFace (deepseek-ai/DeepSeek-V3-0324).
 */
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testAI() {

  try {

    console.log("API KEY:", process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash"
    });

    const result = await model.generateContent(
      "Say hello"
    );

    const response = result.response.text();

    console.log(response);

  } catch (err) {

    console.log("FULL ERROR:");
    console.log(err);

  }

}

testAI();