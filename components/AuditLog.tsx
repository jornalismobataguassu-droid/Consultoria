import React from 'react';
import { backend } from '../services/mockBackend';
import { Card } from './ui/UI';
import { ShieldCheck } from 'lucide-react';

export const AuditLog = () => {
  const logs = backend.getLogs();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Audit Log</h2>
        <p className="text-slate-500">Registro imutável de todas as ações do sistema.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-500 sticky top-0">
              <tr>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Ação</th>
                <th className="px-6 py-4">Detalhes</th>
                <th className="px-6 py-4">IP Origem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 font-semibold text-slate-700">{log.user}</td>
                  <td className="px-6 py-3">
                    <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-600">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600 max-w-xs truncate" title={log.details}>{log.details}</td>
                  <td className="px-6 py-3 text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
             <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                <ShieldCheck className="w-8 h-8 opacity-50" />
                <p>Nenhum registro de auditoria encontrado.</p>
             </div>
          )}
        </div>
      </Card>
    </div>
  );
};
