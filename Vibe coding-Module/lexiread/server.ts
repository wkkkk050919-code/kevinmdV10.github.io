import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // API Routes
  app.post("/api/lookup", async (req, res) => {
    const { word, language } = req.body;

    if (!word || !language) {
      return res.status(400).json({ error: "Word and language are required" });
    }

    const prompt = `
      You are a language teacher. Provide a concise Chinese definition and one example sentence for the following word.
      Word: ${word}
      Source Language: ${language === "EN" ? "English" : "French"}
      
      Return ONLY a JSON object in this format:
      {
        "word": "${word}",
        "definition": "Short Chinese definition",
        "example": "Original example sentence",
        "example_translation": "Chinese translation of the example sentence"
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response text in case Gemini adds markdown code blocks
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(jsonStr);
      
      res.json(parsedData);
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to look up word" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
