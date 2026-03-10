import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Metric {
  epoch: number;
  loss: number;
  accuracy: number;
}

export default function TrainingChart() {
  const [data, setData] = useState<Metric[]>([]);

  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const result = await response.json();
        setData(result.data || []);
        setIsTraining(result.isTraining || false);
      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      }
    };

    fetchMetrics();
    
    let interval: NodeJS.Timeout | null = null;
    if (isTraining) {
      interval = setInterval(fetchMetrics, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTraining]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-zinc-200 mt-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">Progresso do Treinamento</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="epoch" label={{ value: 'Época', position: 'insideBottom', offset: -5 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="loss" stroke="#ef4444" name="Perda (Loss)" />
            <Line type="monotone" dataKey="accuracy" stroke="#10b981" name="Acurácia" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
