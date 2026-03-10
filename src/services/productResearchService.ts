import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateProductRoadmap(niche: string) {
  const prompt = `
    Você é um especialista em design de conteúdo digital e estratégia de e-books.
    O usuário deseja encontrar e remodelar modelos de e-books de sucesso no nicho: "${niche}".
    
    Por favor, forneça uma resposta em JSON com a seguinte estrutura:
    {
      "tema": "Um tema central para a remodelagem do e-book",
      "roteiro": {
        "identificarModelos": "Sugestões de IA para identificar modelos de e-books populares e bem-sucedidos",
        "analisarDados": "Sugestões de IA para analisar o que torna esses modelos eficazes (design, estrutura, engajamento)",
        "remodelar": "Sugestões de IA para remodelar o design, a estrutura e a interatividade do e-book",
        "testarValidar": "Sugestões de IA para testar e validar o novo modelo com o público-alvo"
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("A IA não retornou uma resposta.");
  }

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Erro ao parsear JSON da IA:", response.text);
    throw new Error("Erro ao processar a resposta da IA.");
  }
}
