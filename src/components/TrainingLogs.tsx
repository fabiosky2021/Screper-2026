import React, { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export default function TrainingLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/logs');
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-zinc-200 mt-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">Logs de Treinamento</h2>
      <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className="mb-1">
            <span className="text-zinc-500">[{log.timestamp}]</span>{' '}
            <span className={log.level === 'error' ? 'text-red-400' : 'text-emerald-400'}>
              {log.level.toUpperCase()}
            </span>{' '}
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
