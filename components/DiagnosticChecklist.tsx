

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from './ui/UI';
import { backend } from '../services/mockBackend';
import { DiagnosticData, DiagnosticChecklist as ChecklistType } from '../types';
import { ClipboardCheck, Save, ClipboardList, HardHat, Info, Lock } from 'lucide-react';

interface DiagnosticChecklistProps {
  role: 'admin' | 'client';
  clientId?: string;
  clientName?: string;
}

export const DiagnosticChecklist: React.FC<DiagnosticChecklistProps> = ({ role, clientId, clientName }) => {
  const [activeTab, setActiveTab] = useState<'stage1' | 'stage2'>('stage1');
  const [checklist, setChecklist] = useState<ChecklistType | null>(null);
  const [data, setData] = useState<DiagnosticData>({});
  
  // Admin Selection State
  const clients = backend.getClients();
  const [selectedClientId, setSelectedClientId] = useState<string>(clientId || '');

  useEffect(() => {
    // If admin and no client selected, don't load
    if (role === 'admin' && !selectedClientId) return;
    
    // Determine the target ID
    const targetId = role === 'admin' ? selectedClientId : clientId;
    if (!targetId) return;

    const loaded = backend.getChecklist(targetId);
    setChecklist(loaded);
    setData(loaded.data || {});
  }, [selectedClientId, role, clientId]);

  const handleSave = () => {
    const targetId = role === 'admin' ? selectedClientId : clientId;
    if (!targetId) return;

    const updatedChecklist: ChecklistType = {
      id: checklist?.id || `chk-${targetId}`,
      clientId: targetId,
      lastUpdated: new Date().toISOString(),
      updatedBy: role === 'admin' ? 'Consultora' : (clientName || 'Cliente'),
      data: data
    };

    backend.saveChecklist(updatedChecklist);
    setChecklist(updatedChecklist);
    alert('Dados salvos com sucesso!');
  };

  // Helper to update specific data sections
  const updateStage1 = (section: keyof DiagnosticData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const updateStage2 = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      audit: {
        ...(prev.audit || {}),
        [field]: value
      } as any
    }));
  };

  // --- RENDER HELPERS ---
  const SectionHeader = ({ title, num }: { title: string, num: string }) => (
    <div className="border-b border-slate-200 pb-2 mb-4 mt-6 first:mt-0">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">{num}</span>
        {title}
      </h3>
    </div>
  );

  if (role === 'admin' && !selectedClientId) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Checklist de Diagnóstico</h2>
        <Card className="p-8 text-center space-y-4">
           <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
           <p className="text-slate-500">Selecione um cliente para visualizar ou editar o checklist.</p>
           <select 
             className="mx-auto block w-64 rounded-md border border-slate-300 px-3 py-2 text-sm"
             onChange={(e) => setSelectedClientId(e.target.value)}
             value={selectedClientId}
           >
             <option value="">Selecione...</option>
             {clients.map(c => <option key={c.id} value={c.id}>{c.mainCompany.razaoSocial}</option>)}
           </select>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Checklist de Diagnóstico</h2>
          <p className="text-slate-500">
            {role === 'admin' 
              ? `Gerenciando: ${clients.find(c => c.id === selectedClientId)?.mainCompany.razaoSocial}`
              : 'Preencha as informações preliminares para agilizar nossa visita.'}
          </p>
        </div>
        <div className="flex gap-2">
           {role === 'admin' && (
             <Button variant="ghost" onClick={() => setSelectedClientId('')}>Trocar Cliente</Button>
           )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-300">
        <button
          onClick={() => setActiveTab('stage1')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'stage1' ? 'border-teal-600 text-teal-800 bg-teal-50' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Info className="w-4 h-4" /> Etapa 1: Pré-Visita (Cliente)
        </button>
        <button
          onClick={() => setActiveTab('stage2')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'stage2' ? 'border-purple-600 text-purple-800 bg-purple-50' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HardHat className="w-4 h-4" /> Etapa 2: Visita Técnica (Consultora)
        </button>
      </div>

      {/* CONTENT */}
      <Card className="p-8">
        {/* STAGE 1 FORM */}
        {activeTab === 'stage1' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800 mb-6">
               <strong>Instrução ao Cliente:</strong> Por favor, preencha os dados abaixo com o máximo de precisão possível antes da visita técnica. Isso otimizará nosso tempo de diagnóstico.
            </div>

            <section>
              <SectionHeader num="1" title="Dados Gerais da Empresa" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Razão Social" value={data.general?.razaoSocial || ''} onChange={e => updateStage1('general', 'razaoSocial', e.target.value)} />
                 <Input label="CNPJ" value={data.general?.cnpj || ''} onChange={e => updateStage1('general', 'cnpj', e.target.value)} />
                 <Input label="Endereço da Sede" className="md:col-span-2" value={data.general?.endereco || ''} onChange={e => updateStage1('general', 'endereco', e.target.value)} />
                 <Input label="Nome do Responsável pelas Informações" value={data.general?.responsavelInfo || ''} onChange={e => updateStage1('general', 'responsavelInfo', e.target.value)} />
                 <Input label="E-mail e Telefone" value={data.general?.contato || ''} onChange={e => updateStage1('general', 'contato', e.target.value)} />
                 
                 <div className="md:col-span-2 mt-4">
                    <label className="text-sm font-medium text-slate-700 block mb-1">Outras empresas do conglomerado (se houver)</label>
                    <textarea 
                        className="w-full border border-slate-300 rounded-md p-2 text-sm h-24 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="Liste CNPJ e Razão Social das demais empresas..."
                        value={data.general?.outrasEmpresas || ''}
                        onChange={e => updateStage1('general', 'outrasEmpresas', e.target.value)}
                    />
                 </div>
              </div>
            </section>

            <section>
              <SectionHeader num="2" title="Estrutura Organizacional" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div className="md:col-span-3">
                   <label className="text-sm font-medium text-slate-700 block mb-1">A empresa possui organograma formal?</label>
                   <select 
                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                     value={data.structure?.hasOrganograma || ''}
                     onChange={e => updateStage1('structure', 'hasOrganograma', e.target.value)}
                   >
                     <option value="">Selecione...</option>
                     <option value="sim">Sim</option>
                     <option value="nao">Não</option>
                   </select>
                 </div>
              </div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Total de Funcionários</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                 <Input type="number" label="CLT" value={data.structure?.totalClt || ''} onChange={e => updateStage1('structure', 'totalClt', e.target.value)} />
                 <Input type="number" label="Intermitentes" value={data.structure?.totalIntermitentes || ''} onChange={e => updateStage1('structure', 'totalIntermitentes', e.target.value)} />
                 <Input type="number" label="Aprendizes" value={data.structure?.totalAprendizes || ''} onChange={e => updateStage1('structure', 'totalAprendizes', e.target.value)} />
                 <Input type="number" label="Estagiários" value={data.structure?.totalEstagiarios || ''} onChange={e => updateStage1('structure', 'totalEstagiarios', e.target.value)} />
              </div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Distribuição da Força de Trabalho</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                 <Input type="number" label="Vigilantes" value={data.structure?.totalVigilantes || ''} onChange={e => updateStage1('structure', 'totalVigilantes', e.target.value)} />
                 <Input type="number" label="Porteiros" value={data.structure?.totalPorteiros || ''} onChange={e => updateStage1('structure', 'totalPorteiros', e.target.value)} />
                 <Input type="number" label="Serv. Gerais" value={data.structure?.totalGerais || ''} onChange={e => updateStage1('structure', 'totalGerais', e.target.value)} />
                 <Input type="number" label="Administrativo" value={data.structure?.totalAdm || ''} onChange={e => updateStage1('structure', 'totalAdm', e.target.value)} />
              </div>
              <Input type="number" label="Quantos postos ativos a empresa opera hoje?" value={data.structure?.postosAtivos || ''} onChange={e => updateStage1('structure', 'postosAtivos', e.target.value)} />
            </section>

            <section>
              <SectionHeader num="3" title="Recrutamento e Seleção" />
              <div className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Como são captados candidatos?</label>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      {['Indicação', 'Redes Sociais', 'Portais de Emprego', 'Banco Interno'].map(opt => (
                        <label key={opt} className="flex items-center gap-2">
                           <input 
                             type="checkbox" 
                             checked={(data.recruitment?.sources || []).includes(opt)}
                             onChange={(e) => {
                               const current = data.recruitment?.sources || [];
                               const newVal = e.target.checked ? [...current, opt] : current.filter(x => x !== opt);
                               updateStage1('recruitment', 'sources', newVal);
                             }}
                           />
                           {opt}
                        </label>
                      ))}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col text-sm font-medium text-slate-700">
                       Há Psicotécnico?
                       <select className="mt-1 border border-slate-300 rounded p-2" value={data.recruitment?.hasPsicotecnico || ''} onChange={e => updateStage1('recruitment', 'hasPsicotecnico', e.target.value)}>
                          <option value="">Select...</option><option value="sim">Sim</option><option value="nao">Não</option>
                       </select>
                    </label>
                    <label className="flex flex-col text-sm font-medium text-slate-700">
                       Há Teste Físico?
                       <select className="mt-1 border border-slate-300 rounded p-2" value={data.recruitment?.hasTesteFisico || ''} onChange={e => updateStage1('recruitment', 'hasTesteFisico', e.target.value)}>
                          <option value="">Select...</option><option value="sim">Sim</option><option value="nao">Não</option>
                       </select>
                    </label>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Tempo médio para preenchimento de vaga" value={data.recruitment?.tempoMedioVaga || ''} onChange={e => updateStage1('recruitment', 'tempoMedioVaga', e.target.value)} />
                    <Input label="% Aprovados vs Reprovados" value={data.recruitment?.taxaAprovacao || ''} onChange={e => updateStage1('recruitment', 'taxaAprovacao', e.target.value)} />
                 </div>
              </div>
            </section>

            <section>
              <SectionHeader num="4" title="Departamento Pessoal (Visão Interna)" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">A folha é:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm"><input type="radio" name="folha" value="interna" checked={data.dpInterno?.tipoFolha === 'interna'} onChange={() => updateStage1('dpInterno', 'tipoFolha', 'interna')} /> Interna</label>
                      <label className="flex items-center gap-2 text-sm"><input type="radio" name="folha" value="terceirizada" checked={data.dpInterno?.tipoFolha === 'terceirizada'} onChange={() => updateStage1('dpInterno', 'tipoFolha', 'terceirizada')} /> Terceirizada</label>
                    </div>
                 </div>
                 <Input label="Sistema utilizado para folha" value={data.dpInterno?.sistemaFolha || ''} onChange={e => updateStage1('dpInterno', 'sistemaFolha', e.target.value)} />
                 
                 <div>
                   <label className="text-sm font-medium text-slate-700 block mb-1">Controle de Ponto</label>
                   <select className="w-full border border-slate-300 rounded p-2 text-sm" value={data.dpInterno?.tipoPonto || ''} onChange={e => updateStage1('dpInterno', 'tipoPonto', e.target.value)}>
                      <option value="">Selecione...</option>
                      <option value="relogio">Relógio Eletrônico</option>
                      <option value="app">App</option>
                      <option value="planilha">Planilha</option>
                      <option value="manual">Manual</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-sm font-medium text-slate-700 block mb-1">Escala mais utilizada</label>
                   <select className="w-full border border-slate-300 rounded p-2 text-sm" value={data.dpInterno?.tipoEscala || ''} onChange={e => updateStage1('dpInterno', 'tipoEscala', e.target.value)}>
                      <option value="">Selecione...</option>
                      <option value="12x36">12x36</option>
                      <option value="5x2">5x2</option>
                      <option value="6x1">6x1</option>
                      <option value="outra">Outra</option>
                   </select>
                 </div>
                 <Input label="Gestão de benefícios (Manual ou Auto?)" value={data.dpInterno?.gestaoBeneficios || ''} onChange={e => updateStage1('dpInterno', 'gestaoBeneficios', e.target.value)} />
                 <label className="flex flex-col text-sm font-medium text-slate-700">
                    Reciclagem de vigilantes (CNV) é controlada?
                    <select className="mt-1 border border-slate-300 rounded p-2" value={data.dpInterno?.controlaReciclagem || ''} onChange={e => updateStage1('dpInterno', 'controlaReciclagem', e.target.value)}>
                      <option value="">Select...</option><option value="sim">Sim</option><option value="nao">Não</option>
                    </select>
                 </label>
              </div>
            </section>

            <section>
              <SectionHeader num="5" title="Cargos, Salários e Política" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <label className="flex flex-col text-sm font-medium text-slate-700">
                    Possui plano de cargos e salários?
                    <select className="mt-1 border border-slate-300 rounded p-2" value={data.cargosSalarios?.hasPlano || ''} onChange={e => updateStage1('cargosSalarios', 'hasPlano', e.target.value)}>
                      <option value="">Select...</option><option value="sim">Sim</option><option value="nao">Não</option>
                    </select>
                 </label>
                 <label className="flex flex-col text-sm font-medium text-slate-700">
                    Segue convenção coletiva?
                    <select className="mt-1 border border-slate-300 rounded p-2" value={data.cargosSalarios?.segueConvencao || ''} onChange={e => updateStage1('cargosSalarios', 'segueConvencao', e.target.value)}>
                      <option value="">Select...</option><option value="sim">Sim</option><option value="nao">Não</option>
                    </select>
                 </label>
                 <label className="flex flex-col text-sm font-medium text-slate-700">
                    Política de promoção/mérito?
                    <select className="mt-1 border border-slate-300 rounded p-2" value={data.cargosSalarios?.politicaPromocao || ''} onChange={e => updateStage1('cargosSalarios', 'politicaPromocao', e.target.value)}>
                      <option value="">Select...</option><option value="sim">Sim</option><option value="nao">Não</option>
                    </select>
                 </label>
              </div>
            </section>

            <section>
              <SectionHeader num="6" title="Saúde e Segurança (SST)" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="SST é interna ou terceirizada?" value={data.sst?.tipoSst || ''} onChange={e => updateStage1('sst', 'tipoSst', e.target.value)} />
                <div>
                   <label className="text-sm font-medium text-slate-700 block mb-1">ASOs controlados por:</label>
                   <select className="w-full border border-slate-300 rounded p-2 text-sm" value={data.sst?.controleAsos || ''} onChange={e => updateStage1('sst', 'controleAsos', e.target.value)}>
                      <option value="">Selecione...</option>
                      <option value="sistema">Sistema</option>
                      <option value="planilha">Planilha</option>
                      <option value="manual">Manual</option>
                   </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col text-sm font-medium text-slate-700">
                        Ficha de EPI formalizada?
                        <select className="mt-1 border border-slate-300 rounded p-2" value={data.sst?.fichaEpi || ''} onChange={e => updateStage1('sst', 'fichaEpi', e.target.value)}>
                        <option value="">Select...</option><option value="sim">Sim</option><option value="nao">Não</option>
                        </select>
                    </label>
                    <label className="flex flex-col text-sm font-medium text-slate-700">
                        Existe CIPA?
                        <select className="mt-1 border border-slate-300 rounded p-2" value={data.sst?.hasCipa || ''} onChange={e => updateStage1('sst', 'hasCipa', e.target.value)}>
                        <option value="">Select...</option><option value="sim">Sim</option><option value="nao">Não</option>
                        </select>
                    </label>
                 </div>
                 <Input label="Afastamentos: como são monitorados?" value={data.sst?.monitoramentoAfastamento || ''} onChange={e => updateStage1('sst', 'monitoramentoAfastamento', e.target.value)} />
                 <Input label="Taxa média de acidentes (último ano)" value={data.sst?.taxaAcidentes || ''} onChange={e => updateStage1('sst', 'taxaAcidentes', e.target.value)} />
              </div>
            </section>

            <section>
               <SectionHeader num="7" title="Relações Trabalhistas" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Turnover (últimos 12 meses %)" value={data.relacoes?.turnover || ''} onChange={e => updateStage1('relacoes', 'turnover', e.target.value)} />
                  <Input label="Absenteísmo médio %" value={data.relacoes?.absenteismo || ''} onChange={e => updateStage1('relacoes', 'absenteismo', e.target.value)} />
                  <div className="md:col-span-2">
                     <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <input type="checkbox" checked={data.relacoes?.hasProcessos === 'sim'} onChange={e => updateStage1('relacoes', 'hasProcessos', e.target.checked ? 'sim' : 'nao')} />
                        Há histórico de processos trabalhistas?
                     </label>
                     {data.relacoes?.hasProcessos === 'sim' && (
                        <Input label="Principais motivos" value={data.relacoes?.motivosProcessos || ''} onChange={e => updateStage1('relacoes', 'motivosProcessos', e.target.value)} />
                     )}
                  </div>
               </div>
            </section>

            <section>
               <SectionHeader num="8" title="Tecnologia" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Sistema de ponto/escala" value={data.tech?.sistemaPonto || ''} onChange={e => updateStage1('tech', 'sistemaPonto', e.target.value)} />
                  <Input label="Sistema de folha" value={data.tech?.sistemaFolha || ''} onChange={e => updateStage1('tech', 'sistemaFolha', e.target.value)} />
                  <Input label="Comunicação Base/Postos" value={data.tech?.comunicacaoBase || ''} onChange={e => updateStage1('tech', 'comunicacaoBase', e.target.value)} />
               </div>
            </section>
          </div>
        )}

        {/* STAGE 2 FORM (CONSULTANT) */}
        {activeTab === 'stage2' && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-sm text-purple-800 mb-6 flex items-start gap-3">
               <HardHat className="w-5 h-5 mt-1" />
               <div>
                  <strong>Área Técnica da Consultora:</strong> Este checklist deve ser preenchido durante a visita de 4 horas para validar as informações da etapa anterior e aprofundar o diagnóstico.
               </div>
            </div>

            {role === 'client' && (
               <div className="flex items-center justify-center p-8 text-slate-400 gap-2 border-2 border-dashed border-slate-200 rounded-lg">
                  <Lock className="w-5 h-5" /> Esta seção é de preenchimento exclusivo da Borges Consultoria.
               </div>
            )}

            <div className={role === 'client' ? 'opacity-50 pointer-events-none grayscale' : ''}>
               <section>
                  <SectionHeader num="1" title="Auditoria da Estrutura Operacional" />
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Observações de Campo</label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-md p-3 text-sm h-32 focus:ring-2 focus:ring-purple-500"
                    placeholder="Conferência organograma, fluxo comunicação, visão dos postos, gargalos operacionais..."
                    value={data.audit?.estruturaOperacional || ''}
                    onChange={e => updateStage2('estruturaOperacional', e.target.value)}
                  />
               </section>

               <section>
                  <SectionHeader num="2" title="Análise Técnica DP" />
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Auditoria de Processos</label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-md p-3 text-sm h-32 focus:ring-2 focus:ring-purple-500"
                    placeholder="Ponto > Folha > Encargos, prazos, horas extras, DSR, admissão..."
                    value={data.audit?.analiseTecnicaDP || ''}
                    onChange={e => updateStage2('analiseTecnicaDP', e.target.value)}
                  />
               </section>

               <section>
                  <SectionHeader num="3" title="Documentação Obrigatória" />
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Status Documental</label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-md p-3 text-sm h-32 focus:ring-2 focus:ring-purple-500"
                    placeholder="CNVs, Reciclagem, Certidões, Atestados, Prontuários..."
                    value={data.audit?.docObrigatoria || ''}
                    onChange={e => updateStage2('docObrigatoria', e.target.value)}
                  />
               </section>

               <section>
                  <SectionHeader num="4" title="Auditoria de SST" />
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Conformidade e Segurança</label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-md p-3 text-sm h-32 focus:ring-2 focus:ring-purple-500"
                    placeholder="ASOs, Ficha EPI, Treinamentos NRs, Afastamentos..."
                    value={data.audit?.sst || ''}
                    onChange={e => updateStage2('sst', e.target.value)}
                  />
               </section>

               <section>
                  <SectionHeader num="5" title="Gestão Jurídica e Trabalhista" />
                  <textarea 
                    className="w-full border border-slate-300 rounded-md p-3 text-sm h-32 focus:ring-2 focus:ring-purple-500"
                    placeholder="Motivos processos, pontos críticos, acordos individuais, riscos atuais..."
                    value={data.audit?.juridico || ''}
                    onChange={e => updateStage2('juridico', e.target.value)}
                  />
               </section>

               <section>
                  <SectionHeader num="6" title="Revisão Tecnológica" />
                  <textarea 
                    className="w-full border border-slate-300 rounded-md p-3 text-sm h-32 focus:ring-2 focus:ring-purple-500"
                    placeholder="Teste sistema ponto, integração folha, rastreabilidade..."
                    value={data.audit?.revisaoTecnologica || ''}
                    onChange={e => updateStage2('revisaoTecnologica', e.target.value)}
                  />
               </section>

               <section>
                  <SectionHeader num="7" title="Mapeamento de Fluxos" />
                  <textarea 
                    className="w-full border border-slate-300 rounded-md p-3 text-sm h-32 focus:ring-2 focus:ring-purple-500"
                    placeholder="Desenho dos fluxos: Admissão, Faltas, Pagamento, Escala..."
                    value={data.audit?.mapeamentoFluxos || ''}
                    onChange={e => updateStage2('mapeamentoFluxos', e.target.value)}
                  />
               </section>

               <section>
                  <SectionHeader num="8" title="Diagnóstico Inicial (Resumo)" />
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                     <p className="text-xs text-slate-500 mb-2">Resumo executivo para relatório final:</p>
                     <ul className="text-xs text-slate-500 list-disc list-inside mb-2">
                        <li>Principais riscos</li>
                        <li>Pontos críticos (imediato)</li>
                        <li>Pontos fortes</li>
                        <li>Ações recomendadas (30 dias)</li>
                     </ul>
                     <textarea 
                        className="w-full border border-slate-300 rounded-md p-3 text-sm h-48 focus:ring-2 focus:ring-purple-500"
                        value={data.audit?.diagnosticoInicial || ''}
                        onChange={e => updateStage2('diagnosticoInicial', e.target.value)}
                     />
                  </div>
               </section>
            </div>
          </div>
        )}

        {/* SAVE BUTTON FOOTER */}
        <div className="pt-8 mt-8 border-t border-slate-200 flex justify-end">
            <Button onClick={handleSave} className="bg-teal-700 hover:bg-teal-800 w-full md:w-auto shadow-lg shadow-teal-900/10" size="lg">
                <Save className="w-5 h-5 mr-2" /> Salvar Progresso
            </Button>
        </div>
      </Card>
    </div>
  );
};