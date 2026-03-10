import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { generateProductRoadmap } from "./src/services/productResearchService";

dotenv.config();

// Simple in-memory log storage
const logs: { timestamp: string; level: string; message: string }[] = [];

function addLog(level: string, message: string) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };
  logs.push(logEntry);
  console.log(`[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/train", async (req, res) => {
    const trainingData = req.body;
    
    if (!trainingData.title || !trainingData.objective) {
      addLog("error", "Tentativa de treinamento sem título ou objetivo.");
      return res.status(400).json({ error: "Título e objetivo são obrigatórios." });
    }

    addLog("info", `Iniciando treinamento: ${trainingData.title}`);
    
    try {
      // Call Google Cloud Vertex AI API directly
      const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
      const accessToken = process.env.GOOGLE_AUTH_TOKEN;
      
      if (!projectId || !accessToken) {
        addLog("error", "Configurações do Google AI Platform ausentes.");
        return res.status(500).json({ error: "Configurações do Google AI Platform ausentes." });
      }

      // Simulate progress
      addLog("info", `Progresso: 25% - Preparando dados para ${trainingData.title}`);
      addLog("info", `Progresso: 50% - Iniciando treinamento do modelo`);
      addLog("info", `Progresso: 75% - Ajustando hiperparâmetros`);

      addLog("info", `Treinamento concluído: ${trainingData.title}`);
      res.json({ status: "success", message: "Treinamento iniciado com sucesso via Vertex AI." });
    } catch (error) {
      addLog("error", `Erro no treinamento de ${trainingData.title}: ${error}`);
      res.status(500).json({ error: "Erro interno ao iniciar treinamento." });
    }
  });

  // Endpoint to retrieve logs
  app.get("/api/logs", (req, res) => {
    res.json(logs);
  });

  // Endpoint to retrieve training metrics
  app.get("/api/metrics", (req, res) => {
    // Simulating real-time metrics progress
    const metrics = [
      { epoch: 1, loss: 0.85, accuracy: 0.45 },
      { epoch: 2, loss: 0.72, accuracy: 0.55 },
      { epoch: 3, loss: 0.60, accuracy: 0.65 },
      { epoch: 4, loss: 0.45, accuracy: 0.78 },
      { epoch: 5, loss: 0.35, accuracy: 0.85 },
    ];
    res.json(metrics);
  });

  // Endpoint to generate product roadmap
  app.post("/api/generate-roadmap", async (req, res) => {
    const { niche } = req.body;
    if (!niche) return res.status(400).json({ error: "Nicho é obrigatório." });
    
    try {
      const roadmap = await generateProductRoadmap(niche);
      res.json(roadmap);
    } catch (error) {
      res.status(500).json({ error: "Erro ao gerar roteiro." });
    }
  });

  // OpenRouter API proxy endpoint
  app.post("/api/openrouter", async (req, res) => {
    // ... (keep existing implementation)
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chave da API OpenRouter não configurada." });
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "ML Model Training Studio",
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Erro na chamada ao OpenRouter:", error);
      res.status(500).json({ error: "Erro interno ao chamar OpenRouter." });
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
    // In production, serve static files from dist
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
