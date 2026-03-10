import React, { useState, useRef } from 'react';
import { Mic, MicOff, Sparkles, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function LiveVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Pronto');
  const [history, setHistory] = useState<string[]>([]);
  const chatRef = useRef<any>(null);

  const startSession = async () => {
    setIsListening(true);
    setStatus('Conectando...');
    setHistory(prev => [...prev, "--- Nova Sessão Iniciada ---"]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "Você é um assistente de voz inteligente. Responda de forma extremamente concisa e direta, como uma mensagem de voz do WhatsApp.",
        },
      });
      setStatus('Pronto para falar');
    } catch (e) {
      console.error(e);
      setStatus('Erro de conexão');
      setIsListening(false);
    }
  };

  const [inputText, setInputText] = useState('');

  const handleSendMessage = async (text: string) => {
    if (!chatRef.current) await startSession();
    setStatus('Pensando...');
    setHistory(prev => [...prev, `Você: ${text}`]);
    
    try {
      const response = await chatRef.current.sendMessage({ message: text });
      const aiText = response.text || "";
      setHistory(prev => [...prev, `Assistente: ${aiText}`]);
      setStatus('Falando...');
      
      const ttsResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText }),
      });
      
      if (!ttsResponse.ok) throw new Error('Falha ao gerar áudio');
      
      const blob = await ttsResponse.blob();
      const url = URL.createObjectURL(blob);
      const audioPlayer = new Audio(url);
      await audioPlayer.play();
      setStatus('Pronto');
    } catch (e) {
      console.error(e);
      setStatus('Erro de áudio');
    }
  };

  const stopSession = () => {
    setIsListening(false);
    setStatus('Pronto');
  };

  return (
    <div className="flex flex-col p-6 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl mt-8 text-zinc-100">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-bold">Assistente de Voz (ElevenLabs)</h2>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="flex w-full gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-grow bg-zinc-800 p-3 rounded-xl border border-zinc-700"
            placeholder="Digite sua mensagem..."
          />
          <button 
            onClick={() => { handleSendMessage(inputText); setInputText(''); }}
            className="bg-emerald-600 px-4 py-2 rounded-xl"
          >
            Enviar
          </button>
        </div>
        <p className="mt-4 text-sm font-mono text-zinc-400">{status}</p>
      </div>

      <div className="mt-6 w-full max-h-48 overflow-y-auto bg-zinc-800 p-4 rounded-xl text-xs font-mono text-zinc-300">
        <div className="flex items-center gap-2 mb-2 text-emerald-400">
          <MessageSquare className="w-4 h-4" />
          <span>Histórico</span>
        </div>
        {history.map((item, i) => <p key={i} className="mb-1">{item}</p>)}
      </div>
    </div>
  );
}
