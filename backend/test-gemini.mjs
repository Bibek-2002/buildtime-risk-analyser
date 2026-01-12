import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function chatWithGemini() {
  const userMessage = "Explain AI in one simple sentence.";

  console.log("🧑 You:", userMessage);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ],
  });

  console.log("\n🤖 Gemini:", response.text);
}

chatWithGemini().catch(console.error);
