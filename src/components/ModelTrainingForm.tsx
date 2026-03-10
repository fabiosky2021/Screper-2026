import React, { useState } from 'react';

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      {status && <div className="mb-4 p-3 bg-zinc-100 rounded-lg text-zinc-800">{status}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input name="title" placeholder="Título do Projeto" onChange={handleChange} className="w-full p-3 border border-zinc-300 rounded-lg" />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <textarea name="objective" placeholder="Objetivo" onChange={handleChange} className="w-full p-3 border border-zinc-300 rounded-lg" />
            {errors.objective && <p className="text-red-500 text-sm mt-1">{errors.objective}</p>}
          </div>
        </div>

        {/* Data */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Dados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="dataSource" placeholder="Fonte" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="dataFormat" placeholder="Formato" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="dataSize" placeholder="Tamanho" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
          </div>
        </div>

        {/* Model */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Modelo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="modelType" placeholder="Tipo" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="modelArchitecture" placeholder="Arquitetura" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="hyperparameters" placeholder="Hiperparâmetros" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
          </div>
        </div>

        {/* Task */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Tarefa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="trainingTask" placeholder="Tarefa de Treinamento" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="evaluationMetric" placeholder="Métrica de Avaliação" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="optimizationGoal" placeholder="Objetivo de Otimização" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
          </div>
        </div>

        {/* Constraints */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Restrições</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="trainingTime" placeholder="Tempo de Treinamento" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="computeResources" placeholder="Recursos Computacionais" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="budget" placeholder="Orçamento" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
          </div>
        </div>

        {/* Output */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Saída</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="outputFormat" placeholder="Formato" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
            <input name="outputContent" placeholder="Conteúdo" onChange={handleChange} className="p-3 border border-zinc-300 rounded-lg" />
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
