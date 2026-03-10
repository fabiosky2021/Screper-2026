export async function callOpenRouter(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  // Verificação explícita de segurança
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      "A chave da API OpenRouter não foi encontrada. " +
      "Por favor, configure a variável de ambiente 'OPENROUTER_API_KEY' " +
      "no painel de configurações de segredos da plataforma."
    );
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "E-book Remodeler Agent",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Erro OpenRouter:", errorData);
    throw new Error(`Erro na API OpenRouter (${response.status}): ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
