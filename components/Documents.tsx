import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Modal, Badge } from './ui/UI';
import { backend } from '../services/mockBackend';
import { PLACEHOLDERS } from '../constants';
import { Client, Document, Template } from '../types';
import { FileText, Plus, Eye, Download, PenTool, CheckCircle, Save } from 'lucide-react';

interface DocumentsProps {
  role: 'admin' | 'client';
  clientId?: string;
}

// --- EDITOR COMPONENT ---
interface EditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  readOnly?: boolean;
}

const Editor = ({ initialContent, onSave, readOnly = false }: EditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const insertPlaceholder = (key: string) => {
    if (readOnly) return;
    document.execCommand('insertText', false, key);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-lg overflow-hidden border border-slate-300">
      {!readOnly && (
        <div className="bg-slate-200 p-2 flex gap-2 overflow-x-auto border-b border-slate-300">
          {PLACEHOLDERS.map(p => (
            <button 
              key={p.key}
              onClick={() => insertPlaceholder(p.key)}
              title={p.description}
              className="text-xs bg-white border border-slate-300 px-2 py-1 rounded hover:bg-teal-50 hover:text-teal-700 whitespace-nowrap font-mono"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100/50">
        <div 
          ref={editorRef}
          contentEditable={!readOnly}
          className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] p-[20mm] outline-none text-slate-900 leading-relaxed text-justify"
          style={{ fontFamily: '"Times New Roman", Times, serif' }} // Legal document font
          onBlur={(e) => onSave(e.currentTarget.innerHTML)}
        />
      </div>
    </div>
  );
};

// --- MAIN DOCUMENT PAGE ---
export const Documents: React.FC<DocumentsProps> = ({ role, clientId }) => {
  const [view, setView] = useState<'list' | 'editor' | 'preview'>('list');
  const [docs, setDocs] = useState<Document[]>([]);
  const [templates] = useState<Template[]>(backend.getTemplates());
  const [activeDoc, setActiveDoc] = useState<Partial<Document>>({});
  const [selectedClient, setSelectedClient] = useState<string>('');
  
  // Signature State
  const [isSigning, setIsSigning] = useState(false);
  const [signName, setSignName] = useState('');

  const clients = backend.getClients();

  useEffect(() => {
    const allDocs = backend.getDocuments();
    if (role === 'admin') {
      setDocs(allDocs);
    } else {
      setDocs(allDocs.filter(d => d.clientId === clientId));
    }
  }, [role, clientId, view]); // Refresh on view change in case of updates

  const handleCreate = (templateId: string) => {
    const tmpl = templates.find(t => t.id === templateId);
    if (!tmpl) return;
    
    setActiveDoc({
      id: Math.random().toString(36).substr(2, 9),
      title: tmpl.title,
      content: tmpl.content,
      status: 'draft',
      templateId: tmpl.id,
      createdAt: new Date().toISOString()
    });
    setView('editor');
  };

  const saveDoc = () => {
    if (!selectedClient) {
      alert("Selecione um cliente para salvar.");
      return;
    }
    const client = clients.find(c => c.id === selectedClient);
    if (!client) return;

    const processedContent = backend.processPlaceholders(activeDoc.content || '', client);

    const newDoc: Document = {
      ...activeDoc as Document,
      clientId: client.id,
      clientName: client.mainCompany.razaoSocial,
      content: processedContent,
      status: 'pending_signature'
    };

    backend.saveDocument(newDoc);
    setView('list');
  };

  const openPreview = (doc: Document) => {
    setActiveDoc(doc);
    setView('preview');
  };

  const handleSign = () => {
    if (!activeDoc.id || !signName) return;
    
    const signedDoc: Document = {
      ...activeDoc as Document,
      status: 'signed',
      signedBy: signName,
      signedAt: new Date().toISOString(),
      signedIp: `189.32.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`, // Mock IP
      signatureHash: Math.random().toString(36).substr(2, 16).toUpperCase()
    };
    
    // Add signature footer to content visual
    const signatureBlock = `
      <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; font-family: sans-serif; font-size: 10px; color: #666;">
        <p><strong>DOCUMENTO ASSINADO ELETRONICAMENTE</strong></p>
        <p>Assinado por: ${signedDoc.signedBy}</p>
        <p>Data/Hora: ${new Date(signedDoc.signedAt).toLocaleString()}</p>
        <p>IP: ${signedDoc.signedIp}</p>
        <p>Hash: ${signedDoc.signatureHash}</p>
      </div>
    `;
    signedDoc.content += signatureBlock;

    backend.saveDocument(signedDoc);
    backend.logAudit('SIGNATURE', `Documento ${signedDoc.title} assinado por ${signName}`, role === 'client' ? 'Cliente' : 'Consultora');
    setDocs(prev => prev.map(d => d.id === signedDoc.id ? signedDoc : d)); // Optimistic update
    setIsSigning(false);
    setView('list');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {view === 'list' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {role === 'admin' ? 'Biblioteca de Documentos' : 'Meus Documentos'}
              </h2>
              <p className="text-slate-500">
                {role === 'admin' ? 'Gerencie, edite e acompanhe assinaturas.' : 'Visualize e assine seus documentos pendentes.'}
              </p>
            </div>
            
            {role === 'admin' && (
              <div className="flex gap-2">
                <select 
                  className="h-10 rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  onChange={(e) => handleCreate(e.target.value)}
                  value=""
                >
                  <option value="" disabled>+ Novo Documento</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-500">
                <tr>
                  <th className="px-6 py-4">Documento</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {docs.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Nenhum documento encontrado.</td></tr>
                ) : (
                    docs.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-600" />
                        {doc.title}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{doc.clientName}</td>
                        <td className="px-6 py-4">
                        <Badge variant={doc.status === 'signed' ? 'success' : doc.status === 'pending_signature' ? 'warning' : 'default'}>
                            {doc.status === 'signed' ? 'Assinado' : doc.status === 'pending_signature' ? 'Pendente Ass.' : 'Rascunho'}
                        </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openPreview(doc)}>
                          {role === 'client' && doc.status === 'pending_signature' ? <PenTool className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
                          {role === 'client' && doc.status === 'pending_signature' ? <span className="ml-2 text-amber-700 font-bold">Assinar</span> : ''}
                        </Button>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'editor' && role === 'admin' && (
        <div className="flex flex-col h-full gap-4">
           <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 w-1/2">
                <Button variant="ghost" onClick={() => setView('list')}>← Voltar</Button>
                <div className="h-6 w-px bg-slate-300"></div>
                <select 
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setSelectedClient(e.target.value)}
                    value={selectedClient}
                >
                    <option value="" disabled>Selecione o Cliente para preencher...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.mainCompany.razaoSocial}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                 <Button onClick={saveDoc} disabled={!selectedClient}><Save className="w-4 h-4 mr-2" /> Gerar & Salvar</Button>
              </div>
           </div>
           <div className="flex-1 min-h-0">
             <Editor 
                initialContent={activeDoc.content || ''} 
                onSave={(c) => setActiveDoc({...activeDoc, content: c})} 
             />
           </div>
        </div>
      )}

      {view === 'preview' && (
        <div className="flex flex-col h-full gap-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setView('list')}>← Voltar</Button>
                <h3 className="font-bold text-slate-900">{activeDoc.title}</h3>
                {activeDoc.status === 'signed' && <Badge variant="success">Documento Assinado</Badge>}
              </div>
              <div className="flex gap-2">
                 <Button variant="secondary" onClick={() => window.print()}><Download className="w-4 h-4 mr-2" /> PDF / Imprimir</Button>
                 {activeDoc.status !== 'signed' && (
                    <Button onClick={() => setIsSigning(true)} className={role === 'client' ? 'bg-amber-600 hover:bg-amber-700' : ''}>
                      <PenTool className="w-4 h-4 mr-2" /> Assinar Digitalmente
                    </Button>
                 )}
              </div>
           </div>
           <div className="flex-1 min-h-0 overflow-y-auto flex justify-center bg-slate-100/50 p-8">
               <div 
                  className="bg-white shadow-xl w-full max-w-[210mm] p-[20mm] text-slate-900 leading-relaxed text-justify pointer-events-none select-none"
                  dangerouslySetInnerHTML={{ __html: activeDoc.content || '' }}
               />
           </div>
        </div>
      )}

      {/* Signature Modal */}
      <Modal isOpen={isSigning} onClose={() => setIsSigning(false)} title="Assinatura Digital">
        <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded text-amber-800 text-sm">
                Ao clicar em assinar, você concorda com os termos deste documento e a validade da assinatura eletrônica com registro de IP e Timestamp.
            </div>
            <Input label="Digite seu nome completo para assinar" value={signName} onChange={(e) => setSignName(e.target.value)} placeholder="Ex: João da Silva" />
            
            <div className="flex justify-end pt-4">
                <Button onClick={handleSign} disabled={!signName || signName.length < 5}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Assinatura
                </Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};