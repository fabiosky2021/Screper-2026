import React, { useState } from 'react';
import { useToast } from './Toast';

interface Project {
  id: string;
  title: string;
  status: 'Concluído' | 'Em andamento' | 'Falhou';
  startDate: string;
  architecture: string;
  hyperparameters: string;
}

const initialProjects: Project[] = [
  { id: '1', title: 'Previsão de Vendas', status: 'Concluído', startDate: '2026-03-01', architecture: 'LSTM', hyperparameters: 'lr=0.01, batch=32' },
  { id: '2', title: 'Análise de Sentimento', status: 'Em andamento', startDate: '2026-03-08', architecture: 'Transformer', hyperparameters: 'lr=0.001, batch=16' },
  { id: '3', title: 'Classificação de Imagens', status: 'Falhou', startDate: '2026-03-05', architecture: 'ResNet50', hyperparameters: 'lr=0.0001, batch=64' },
];

export default function TrainingHistory() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const { showToast } = useToast();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const simulateStatusChange = (id: string, newStatus: 'Concluído' | 'Falhou') => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        showToast(`Projeto "${p.title}" está agora ${newStatus}`, newStatus === 'Concluído' ? 'success' : 'error');
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-zinc-200 mt-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">Histórico de Treinamentos</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="p-3 font-semibold text-zinc-700">Título</th>
              <th className="p-3 font-semibold text-zinc-700">Status</th>
              <th className="p-3 font-semibold text-zinc-700">Data de Início</th>
              <th className="p-3 font-semibold text-zinc-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <React.Fragment key={project.id}>
                <tr 
                  className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer"
                  onClick={() => toggleExpand(project.id)}
                >
                  <td className="p-3 text-zinc-800 font-medium">{project.title}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' :
                      project.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-600">{project.startDate}</td>
                  <td className="p-3">
                    {project.status === 'Em andamento' && (
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); simulateStatusChange(project.id, 'Concluído'); }} className="text-xs bg-emerald-500 text-white px-2 py-1 rounded">Concluir</button>
                        <button onClick={(e) => { e.stopPropagation(); simulateStatusChange(project.id, 'Falhou'); }} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Falhar</button>
                      </div>
                    )}
                  </td>
                </tr>
                {expandedId === project.id && (
                  <tr className="bg-zinc-50">
                    <td colSpan={4} className="p-4 text-sm text-zinc-700">
                      <p><strong>Arquitetura:</strong> {project.architecture}</p>
                      <p><strong>Hiperparâmetros:</strong> {project.hyperparameters}</p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
