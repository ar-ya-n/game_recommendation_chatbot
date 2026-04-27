require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Actually list models is not well documented but we can just try to instantiate and call a test prompt
  const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello briefly");
      console.log(`[SUCCESS] ${modelName}`);
    } catch (e) {
      console.log(`[FAILED] ${modelName}: ${e.message}`);
    }
  }
}

listModels();
