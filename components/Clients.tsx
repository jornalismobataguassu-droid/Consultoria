import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Badge } from './ui/UI';
import { backend } from '../services/mockBackend';
import { Client, Company } from '../types';
import { Building2, Plus, Search, MapPin, Edit, Lock } from 'lucide-react';

interface ClientsProps {
  role: 'admin' | 'client';
  clientId?: string;
}

export const Clients: React.FC<ClientsProps> = ({ role, clientId }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Client>>({
    mainCompany: { id: '', razaoSocial: '', cnpj: '', endereco: '', cidade: '', uf: '', isMatriz: true },
    subsidiaries: [],
    outrasEmpresasConglomerado: '',
    password: ''
  });

  useEffect(() => {
    const allClients = backend.getClients();
    if (role === 'admin') {
      setClients(allClients);
    } else if (clientId) {
      // For client view, only show their own company
      const myClient = allClients.filter(c => c.id === clientId);
      setClients(myClient);
    }
  }, [role, clientId]);

  const handleSave = () => {
    // Only Admin can save
    if (role !== 'admin') return;

    const newClient: Client = {
      id: selectedClient ? selectedClient.id : Math.random().toString(36).substr(2, 9),
      status: 'active',
      createdAt: selectedClient?.createdAt || new Date().toISOString(),
      mainCompany: formData.mainCompany as Company,
      subsidiaries: formData.subsidiaries || [],
      outrasEmpresasConglomerado: formData.outrasEmpresasConglomerado || '',
      representanteNome: formData.representanteNome || '',
      representanteCpf: formData.representanteCpf || '',
      representanteCargo: formData.representanteCargo || '',
      email: formData.email || '',
      telefone: formData.telefone || '',
      cidadeForo: formData.cidadeForo || '',
      password: formData.password || '123' // Default if empty
    };

    backend.saveClient(newClient);
    setClients(backend.getClients());
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const openNew = () => {
    setSelectedClient(null);
    setFormData({ 
      mainCompany: { id: Date.now().toString(), razaoSocial: '', cnpj: '', endereco: '', cidade: '', uf: '', isMatriz: true },
      password: '123' 
    });
    setIsModalOpen(true);
  };

  const openEdit = (client: Client) => {
    // Clients cannot edit
    if (role !== 'admin') return;

    setSelectedClient(client);
    setFormData({ ...client });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
             {role === 'admin' ? 'Gestão de Clientes' : 'Minha Empresa'}
          </h2>
          <p className="text-slate-500">
             {role === 'admin' ? 'Gerencie empresas e grupos econômicos.' : 'Dados cadastrais da sua empresa.'}
          </p>
        </div>
        {role === 'admin' && (
          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" /> Novo Cliente
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map(client => (
          <Card key={client.id} className="hover:shadow-md transition-shadow group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-teal-50 rounded-lg text-teal-700">
                  <Building2 className="w-6 h-6" />
                </div>
                {role === 'admin' && (
                  <button onClick={() => openEdit(client)} className="text-slate-400 hover:text-teal-600">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 mb-1">{client.mainCompany.razaoSocial}</h3>
              <p className="text-sm text-slate-500 mb-4">{client.mainCompany.cnpj}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-slate-600 gap-2">
                   <MapPin className="w-4 h-4" />
                   {client.mainCompany.cidade}/{client.mainCompany.uf}
                </div>
                {client.subsidiaries.length > 0 && (
                   <div className="flex items-center text-slate-600 gap-2">
                     <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold">
                       +{client.subsidiaries.length} Filiais
                     </span>
                   </div>
                )}
                {role === 'client' && (
                  <div className="pt-2 mt-2 border-t border-slate-100 text-xs text-slate-500">
                    <p><strong>Representante:</strong> {client.representanteNome}</p>
                    <p><strong>Cargo:</strong> {client.representanteCargo}</p>
                  </div>
                )}
                {role === 'admin' && (
                  <div className="pt-2 mt-2 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-1">
                     <Lock className="w-3 h-3" /> Senha definida
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
               <Badge variant="success">Ativo</Badge>
               <span className="text-xs text-slate-400">Desde {new Date(client.createdAt).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit/Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedClient ? "Editar Cliente" : "Novo Cliente"}>
        <div className="space-y-4">
          <h4 className="font-bold text-teal-700 uppercase text-xs tracking-wider">Dados da Matriz</h4>
          <Input 
            label="Razão Social" 
            value={formData.mainCompany?.razaoSocial} 
            onChange={e => setFormData({...formData, mainCompany: {...formData.mainCompany!, razaoSocial: e.target.value}})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="CNPJ" 
              value={formData.mainCompany?.cnpj} 
              onChange={e => setFormData({...formData, mainCompany: {...formData.mainCompany!, cnpj: e.target.value}})} 
            />
            <Input 
              label="Cidade/UF" 
              placeholder="Bataguassu/MS"
              value={`${formData.mainCompany?.cidade || ''}/${formData.mainCompany?.uf || ''}`} 
              onChange={e => {
                const [cid, uf] = e.target.value.split('/');
                setFormData({...formData, mainCompany: {...formData.mainCompany!, cidade: cid, uf: uf || ''}})
              }} 
            />
          </div>
          <Input 
              label="Endereço Completo" 
              value={formData.mainCompany?.endereco} 
              onChange={e => setFormData({...formData, mainCompany: {...formData.mainCompany!, endereco: e.target.value}})} 
          />

          <h4 className="font-bold text-teal-700 uppercase text-xs tracking-wider pt-4">Acesso & Representante</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Senha de Acesso (Login)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Defina a senha..." />
            <Input label="Nome Representante" value={formData.representanteNome} onChange={e => setFormData({...formData, representanteNome: e.target.value})} />
            <Input label="CPF Representante" value={formData.representanteCpf} onChange={e => setFormData({...formData, representanteCpf: e.target.value})} />
            <Input label="Cargo" value={formData.representanteCargo} onChange={e => setFormData({...formData, representanteCargo: e.target.value})} />
          </div>
          <Input label="Cidade do Foro" value={formData.cidadeForo} onChange={e => setFormData({...formData, cidadeForo: e.target.value})} />

          <h4 className="font-bold text-teal-700 uppercase text-xs tracking-wider pt-4">Conglomerado</h4>
          <label className="block text-sm font-medium text-slate-700">Outras empresas do conglomerado</label>
          <textarea 
            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            rows={3}
            placeholder="Liste outras empresas do grupo aqui..."
            value={formData.outrasEmpresasConglomerado}
            onChange={e => setFormData({...formData, outrasEmpresasConglomerado: e.target.value})}
          />

          <div className="pt-4 flex justify-end gap-3">
             <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
             <Button onClick={handleSave}>Salvar Cliente</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};