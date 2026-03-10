import React, { useState } from 'react';

export default function ProductRemodelingDashboard() {
  const [niche, setNiche] = useState('');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setRoadmap(null);
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar roteiro');
      }
      setRoadmap(data);
    } catch (error: any) {
      console.error('Erro ao gerar roteiro:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-zinc-200 mt-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">Remodelagem de Produtos com IA</h2>
      <div className="flex gap-4 mb-6">
        <input 
          value={niche} 
          onChange={(e) => setNiche(e.target.value)}
          placeholder="Defina o nicho (ex: eletrônicos, casa e cozinha)"
          className="flex-1 p-3 border border-zinc-300 rounded-lg"
        />
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
        >
          {isLoading ? 'Gerando...' : 'Gerar Roteiro'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      {roadmap && roadmap.roteiro && (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-100 rounded-lg">
            <h3 className="text-xl font-semibold text-zinc-900">Tema: {roadmap.tema}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-zinc-200 rounded-lg">
              <h4 className="font-semibold text-zinc-900">Identificar Modelos</h4>
              <p className="text-sm text-zinc-600">{roadmap.roteiro.identificarModelos}</p>
            </div>
            <div className="p-4 border border-zinc-200 rounded-lg">
              <h4 className="font-semibold text-zinc-900">Analisar Eficácia</h4>
              <p className="text-sm text-zinc-600">{roadmap.roteiro.analisarDados}</p>
            </div>
            <div className="p-4 border border-zinc-200 rounded-lg">
              <h4 className="font-semibold text-zinc-900">Remodelar</h4>
              <p className="text-sm text-zinc-600">{roadmap.roteiro.remodelar}</p>
            </div>
            <div className="p-4 border border-zinc-200 rounded-lg">
              <h4 className="font-semibold text-zinc-900">Testar e Validar</h4>
              <p className="text-sm text-zinc-600">{roadmap.roteiro.testarValidar}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
