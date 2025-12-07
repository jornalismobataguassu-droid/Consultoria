import React from 'react';
import { Card, Badge } from './ui/UI';
import { Users, FileText, CheckCircle, Clock, Building2 } from 'lucide-react';
import { backend } from '../services/mockBackend';

interface DashboardProps {
  role: 'admin' | 'client';
  clientId?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ role, clientId }) => {
  const clients = backend.getClients();
  const allDocs = backend.getDocuments();
  const logs = backend.getLogs();

  // Filter Data based on Role
  const docs = role === 'admin' 
    ? allDocs 
    : allDocs.filter(d => d.clientId === clientId);

  const stats = role === 'admin' ? [
    { label: 'Clientes Ativos', value: clients.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Documentos Gerados', value: docs.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Assinados', value: docs.filter(d => d.status === 'signed').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Pendentes', value: docs.filter(d => d.status === 'pending_signature').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  ] : [
    { label: 'Meus Documentos', value: docs.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Assinados', value: docs.filter(d => d.status === 'signed').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Pendentes de Assinatura', value: docs.filter(d => d.status === 'pending_signature').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Empresas no Grupo', value: clients.find(c => c.id === clientId)?.subsidiaries.length ? (clients.find(c => c.id === clientId)!.subsidiaries.length + 1) : 1, icon: Building2, color: 'text-slate-600', bg: 'bg-slate-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          {role === 'admin' ? 'Dashboard Geral' : 'Bem-vindo ao seu Portal'}
        </h2>
        <p className="text-slate-500">
          {role === 'admin' ? 'Visão geral da Borges Consultoria' : 'Acompanhe seus documentos e processos.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className={`grid grid-cols-1 ${role === 'admin' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6`}>
        {/* Recent Documents */}
        <Card className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">
              {role === 'admin' ? 'Documentos Recentes' : 'Seus Documentos Recentes'}
            </h3>
          </div>
          <div className="p-6 flex-1">
            {docs.length === 0 ? (
              <div className="text-center py-10 text-slate-400">Nenhum documento encontrado.</div>
            ) : (
              <div className="space-y-4">
                {docs.slice(0, 5).map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{doc.title}</p>
                        <p className="text-xs text-slate-500">{doc.clientName}</p>
                      </div>
                    </div>
                    <Badge variant={doc.status === 'signed' ? 'success' : 'warning'}>
                      {doc.status === 'signed' ? 'Assinado' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Audit Log Preview - ONLY FOR ADMIN */}
        {role === 'admin' && (
          <Card className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Atividades Recentes (Audit Log)</h3>
            </div>
            <div className="p-6 flex-1">
              <div className="space-y-4">
                {logs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex gap-3 text-sm">
                    <div className="min-w-[60px] text-xs text-slate-400 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{log.action}</p>
                      <p className="text-slate-500 text-xs">{log.details}</p>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && <p className="text-slate-400 text-sm">Nenhuma atividade registrada.</p>}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};