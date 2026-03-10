import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Loader2, Sparkles, FileText } from 'lucide-react';
import { callOpenRouter } from '../services/agentService';

export default function ProductRemodelingDashboard() {
  const [content, setContent] = useState('');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Por favor, cole a descrição ou o conteúdo do produto.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setRoadmap(null);
    try {
      const prompt = `
        Você é um especialista em design de conteúdo digital e estratégia de e-books.
        O usuário forneceu a seguinte descrição/conteúdo de um produto/e-book:
        "${content}"
        
        Analise esse conteúdo e forneça uma resposta em JSON com a seguinte estrutura para remodelá-lo:
        {
          "tema": "Um tema central para a remodelagem do e-book baseado no conteúdo fornecido",
          "roteiro": {
            "identificarModelos": "Como melhorar a estrutura baseada no conteúdo fornecido",
            "analisarDados": "Análise do que torna esse conteúdo eficaz e o que pode ser melhorado",
            "remodelar": "Sugestões concretas para remodelar o design, a estrutura e a interatividade",
            "testarValidar": "Sugestões para testar e validar o novo modelo com o público-alvo"
          }
        }
      `;
      const responseText = await callOpenRouter(prompt);
      const data = JSON.parse(responseText);
      setRoadmap(data);
    } catch (error: any) {
      console.error('Erro ao gerar roteiro:', error);
      setError('Erro ao processar o conteúdo. Verifique se a chave do OpenRouter está configurada.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    
    const canvas = await html2canvas(dashboardRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`roteiro-remodelagem.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-zinc-200 mt-8" ref={dashboardRef}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Remodelagem de Produtos com IA</h2>
        {isLoading && <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />}
        {!isLoading && <Sparkles className="w-6 h-6 text-zinc-400" />}
      </div>
      
      <div className="space-y-4 mb-6">
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="Cole aqui a descrição, o texto ou o conteúdo do e-book/produto que você encontrou..."
          className="w-full p-4 border border-zinc-300 rounded-lg h-40"
        />
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          {isLoading ? 'Agente trabalhando...' : 'Remodelar este Conteúdo'}
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
          <button 
            onClick={exportToPDF}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 mt-4"
          >
            Exportar Roteiro para PDF 📔
          </button>
        </div>
      )}
    </div>
  );
}
