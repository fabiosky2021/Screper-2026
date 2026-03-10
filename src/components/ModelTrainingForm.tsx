import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { callOpenRouter } from '../services/agentService';

export default function ModelTrainingForm() {
  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    dataSource: '',
    dataFormat: '',
    dataSize: '',
    modelType: '',
    modelArchitecture: '',
    hyperparameters: '',
    trainingTask: '',
    evaluationMetric: '',
    optimizationGoal: '',
    trainingTime: '',
    computeResources: '',
    budget: '',
    outputFormat: '',
    outputContent: '',
  });

  const [aiDescription, setAiDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveConfig = () => {
    localStorage.setItem('ml_training_config', JSON.stringify(formData));
    setStatus('Configuração salva com sucesso!');
    setTimeout(() => setStatus(null), 3000);
  };

  const loadConfig = () => {
    const saved = localStorage.getItem('ml_training_config');
    if (saved) {
      setFormData(JSON.parse(saved));
      setStatus('Configuração carregada!');
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus('Nenhuma configuração salva encontrada.');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(formData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracao_ml.json';
    a.click();
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(JSON.parse(event.target?.result as string));
      setStatus('Configuração importada!');
      setTimeout(() => setStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAiGenerate = async () => {
    if (!aiDescription.trim()) return;
    setIsAiLoading(true);
    try {
      const prompt = `
        Você é um especialista em Machine Learning. Preencha o formulário de treinamento de modelos com base na descrição: "${aiDescription}".
        Retorne APENAS um JSON com as chaves: title, objective, dataSource, dataFormat, dataSize, modelType, modelArchitecture, hyperparameters, trainingTask, evaluationMetric, optimizationGoal, trainingTime, computeResources, budget, outputFormat, outputContent.
      `;
      const response = await callOpenRouter(prompt);
      const data = JSON.parse(response);
      setFormData(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error(error);
      setStatus('Erro ao gerar sugestões da IA.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = 'Título é obrigatório';
    if (!formData.objective) newErrors.objective = 'Objetivo é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setStatus('Iniciando treinamento...');
    try {
      const response = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('Treinamento iniciado com sucesso!');
      } else {
        setStatus(`Erro: ${data.error}`);
      }
    } catch (error) {
      setStatus('Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-zinc-200">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">Estúdio de Treinamento de Modelos ML</h1>
      
      {/* AI Assistant Section */}
      <div className="mb-8 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-zinc-900">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          Assistente de IA
        </h2>
        <textarea 
          value={aiDescription}
          onChange={(e) => setAiDescription(e.target.value)}
          placeholder="Descreva seu projeto de ML (ex: 'Quero treinar um modelo para classificar imagens de flores usando um dataset de 10k imagens')"
          className="w-full p-3 border border-zinc-300 rounded-lg mb-3"
          rows={3}
        />
        <button 
          onClick={handleAiGenerate}
          disabled={isAiLoading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
        >
          {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Gerar Sugestões
        </button>
      </div>

      {status && <div className="mb-4 p-3 bg-zinc-100 rounded-lg text-zinc-800">{status}</div>}
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={saveConfig} className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300">Salvar (Local)</button>
        <button type="button" onClick={loadConfig} className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300">Carregar (Local)</button>
        <button type="button" onClick={exportConfig} className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300">Exportar (JSON)</button>
        <label className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300 cursor-pointer">
          Importar (JSON)
          <input type="file" accept=".json" onChange={importConfig} className="hidden" />
        </label>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input name="title" value={formData.title} placeholder="Título do Projeto" onChange={handleChange} className="w-full p-3 border border-zinc-300 rounded-lg" />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <textarea name="objective" value={formData.objective} placeholder="Objetivo" onChange={handleChange} className="w-full p-3 border border-zinc-300 rounded-lg" />
            {errors.objective && <p className="text-red-500 text-sm mt-1">{errors.objective}</p>}
          </div>
        </div>

        {/* Data */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Dados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="dataSource" value={formData.dataSource} placeholder="Fonte" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="dataFormat" value={formData.dataFormat} placeholder="Formato" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="dataSize" value={formData.dataSize} placeholder="Tamanho" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
          </div>
        </div>

        {/* Model */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Modelo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="modelType" value={formData.modelType} placeholder="Tipo" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="modelArchitecture" value={formData.modelArchitecture} placeholder="Arquitetura" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="hyperparameters" value={formData.hyperparameters} placeholder="Hiperparâmetros" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
          </div>
        </div>

        {/* Task */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Tarefa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="trainingTask" value={formData.trainingTask} placeholder="Tarefa de Treinamento" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="evaluationMetric" value={formData.evaluationMetric} placeholder="Métrica de Avaliação" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="optimizationGoal" value={formData.optimizationGoal} placeholder="Objetivo de Otimização" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
          </div>
        </div>

        {/* Constraints */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Restrições</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="trainingTime" value={formData.trainingTime} placeholder="Tempo de Treinamento" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="computeResources" value={formData.computeResources} placeholder="Recursos Computacionais" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="budget" value={formData.budget} placeholder="Orçamento" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
          </div>
        </div>

        {/* Output */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Saída</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="outputFormat" value={formData.outputFormat} placeholder="Formato" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="outputContent" value={formData.outputContent} placeholder="Conteúdo" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full p-4 rounded-xl font-semibold ${isLoading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
        >
          {isLoading ? 'Inicializando...' : 'Inicializar Treinamento'}
        </button>
      </form>
    </div>
  );
}
