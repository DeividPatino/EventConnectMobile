import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Eres un asistente útil y amable." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const botResponse = data.choices?.[0]?.message?.content || "No hay respuesta.";

    res.json({ bot: botResponse });
  } catch (error) {
    console.error("Error al consultar OpenAI:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

// Simple proxy to Nominatim to avoid CORS issues from the browser
// (Nominatim proxy endpoints removed)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server escuchando en http://localhost:${PORT}`));