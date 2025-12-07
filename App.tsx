
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Documents } from './components/Documents';
import { AuditLog } from './components/AuditLog';
import { Presentation } from './components/Presentation';
import { ExitoPage } from './components/ExitoPage';
import { DiagnosticChecklist } from './components/DiagnosticChecklist';
import { backend } from './services/mockBackend';
import { Card, Button, Input, Modal, Badge } from './components/ui/UI';
import { ShieldCheck, User, ArrowRight, Lock, FileText, CheckCircle, Download, KeyRound } from 'lucide-react';
import { Document } from './types';

type UserRole = 'admin' | 'client' | null;

interface AuthState {
  role: UserRole;
  clientId?: string;
  clientName?: string;
  clientPresentationHtml?: string; // HTML content for presentation
  onboardingNDA?: Document | null; // If set, user is stuck in NDA flow
  showPresentation?: boolean; // If true, show presentation layer
}

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ role: null });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExitoPage, setShowExitoPage] = useState(false);
  
  // State for NDA Signature in Mandatory Flow
  const [isSigningNDA, setIsSigningNDA] = useState(false);
  const [ndaSignName, setNdaSignName] = useState('');

  // Helper for Login Screen
  const LoginScreen = () => {
    // Admin State
    const [adminPass, setAdminPass] = useState('');
    const [adminError, setAdminError] = useState('');

    // Client State
    const [loginCnpj, setLoginCnpj] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [clientError, setClientError] = useState('');

    const handleAdminLogin = () => {
       if (adminPass.replace(/\D/g,'') === '01292621109') {
          setAuth({ role: 'admin' });
       } else {
          setAdminError('Senha incorreta.');
       }
    };

    const handleClientLogin = () => {
      if (!loginCnpj || !loginPass) {
        setClientError('Informe o CNPJ e a senha.');
        return;
      }
      
      const client = backend.authenticateClientByCnpj(loginCnpj, loginPass);
      
      if (client) {
        // Check for NDA
        const ndaDoc = backend.getOrProvisionNDA(client.id);
        const needsSignature = ndaDoc && ndaDoc.status !== 'signed';

        setAuth({ 
          role: 'client', 
          clientId: client.id, 
          clientName: client.mainCompany.razaoSocial,
          clientPresentationHtml: client.presentationHtml,
          onboardingNDA: needsSignature ? ndaDoc : null,
          showPresentation: false // We set this true after NDA
        });
        setActiveTab('dashboard');
      } else {
        setClientError('CNPJ não encontrado ou senha incorreta.');
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Admin Login */}
          <Card className="p-8 flex flex-col items-center text-center space-y-6 hover:shadow-lg transition-shadow border-t-4 border-t-teal-800">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-800">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Área da Consultoria</h2>
              <p className="text-slate-500 mt-2">Acesso exclusivo Danieli Borges.</p>
            </div>
            <div className="w-full pt-4 text-left">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Senha da Consultora</label>
              <div className="relative mt-1">
                 <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                 <input 
                    type="password"
                    className="w-full h-10 rounded-md border border-slate-300 pl-9 pr-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={adminPass}
                    onChange={(e) => { setAdminPass(e.target.value); setAdminError(''); }}
                    placeholder="••••••••••"
                 />
              </div>
              {adminError && <p className="text-red-600 text-xs font-medium mt-2">{adminError}</p>}
              
              <Button 
                className="w-full mt-4 bg-teal-700 hover:bg-teal-800" 
                onClick={handleAdminLogin}
                disabled={!adminPass}
              >
                Acessar Sistema <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Client Login */}
          <Card className="p-8 flex flex-col items-center text-center space-y-6 hover:shadow-lg transition-shadow border-t-4 border-t-blue-600">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Área do Cliente</h2>
              <p className="text-slate-500 mt-2">Acesse com CNPJ e Senha.</p>
            </div>
            <div className="w-full pt-4 space-y-3">
              <div className="text-left">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CNPJ da Empresa</label>
                <div className="relative mt-1">
                   <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                   <input 
                      type="text"
                      className="w-full h-10 rounded-md border border-slate-300 pl-9 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={loginCnpj}
                      onChange={(e) => { setLoginCnpj(e.target.value); setClientError(''); }}
                      placeholder="00.000.000/0000-00"
                   />
                </div>
              </div>
              
              <div className="text-left">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Senha de Acesso</label>
                <div className="relative mt-1">
                   <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                   <input 
                      type="password"
                      className="w-full h-10 rounded-md border border-slate-300 pl-9 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={loginPass}
                      onChange={(e) => { setLoginPass(e.target.value); setClientError(''); }}
                      placeholder="••••••"
                   />
                </div>
              </div>

              {clientError && <p className="text-red-600 text-xs font-medium">{clientError}</p>}

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" 
                onClick={handleClientLogin}
                disabled={!loginCnpj || !loginPass}
              >
                Entrar como Cliente <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

        </div>
        
        <div className="fixed bottom-6 text-center w-full">
           <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Produzido por <button onClick={() => setShowExitoPage(true)} className="text-teal-700 font-bold hover:underline focus:outline-none">Êxito Comunicação e Marketing</button>
          </p>
        </div>
      </div>
    );
  };

  const handleNDASignature = () => {
     if (!auth.onboardingNDA || !ndaSignName) return;

     const doc = auth.onboardingNDA;
     const signedDoc: Document = {
      ...doc,
      status: 'signed',
      signedBy: ndaSignName,
      signedAt: new Date().toISOString(),
      signedIp: `189.32.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`, // Mock IP
      signatureHash: Math.random().toString(36).substr(2, 16).toUpperCase()
    };

    // Client Signature Block
    const signatureBlock = `
      <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border: 1px solid #d97706; border-radius: 8px; font-family: sans-serif; font-size: 11px; color: #78350f;">
        <p style="font-weight: bold; margin-bottom: 4px;">✅ ASSINADO DIGITALMENTE PELO CLIENTE</p>
        <p><strong>Assinado por:</strong> ${signedDoc.signedBy}</p>
        <p><strong>Data/Hora:</strong> ${new Date(signedDoc.signedAt).toLocaleString()}</p>
        <p><strong>IP:</strong> ${signedDoc.signedIp}</p>
        <p><strong>Hash:</strong> ${signedDoc.signatureHash}</p>
      </div>
    `;
    signedDoc.content += signatureBlock;

    backend.saveDocument(signedDoc);
    backend.logAudit('NDA_SIGNED', `NDA assinado pelo cliente ${signedDoc.clientName}`, 'Cliente');
    
    setIsSigningNDA(false);
    
    // Transition to Presentation
    setAuth(prev => ({ 
      ...prev, 
      onboardingNDA: null, 
      showPresentation: true 
    }));
  };

  const handlePresentationContinue = () => {
    // 1. Generate Proposal Document for the user to keep
    if (auth.clientId) {
      backend.generateProposalDocument(auth.clientId);
    }

    // 2. Go to Dashboard
    setAuth(prev => ({ ...prev, showPresentation: false }));
  };

  // --- RENDER LOGIC ---

  // Global Overlay: Exito Page
  if (showExitoPage) {
    return <ExitoPage onBack={() => setShowExitoPage(false)} />;
  }

  if (!auth.role) {
    return <LoginScreen />;
  }

  // MANDATORY NDA WALL
  if (auth.role === 'client' && auth.onboardingNDA) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <header className="bg-blue-900 text-white p-6 shadow-md text-center">
           <h1 className="text-xl font-bold">Borges Consultoria - Kit Boas-Vindas</h1>
           <p className="text-sm opacity-80">Etapa Obrigatória: Assinatura de Termo</p>
        </header>

        <main className="flex-1 p-4 md:p-8 flex justify-center">
           <div className="max-w-4xl w-full flex flex-col gap-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded shadow-sm">
                 <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-amber-800">Ação Necessária</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Para acessar sua área restrita e visualizar os documentos da consultoria, é obrigatório ler e assinar eletronicamente o <strong>Termo de Confidencialidade (NDA)</strong> abaixo.
                      </p>
                      <p className="text-xs text-amber-600 mt-2">
                        * Este documento já foi previamente assinado pela Consultora Danieli Borges.
                      </p>
                    </div>
                 </div>
              </div>

              <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-slate-200 flex flex-col h-[60vh]">
                 <div className="flex-1 overflow-y-auto p-8 bg-slate-50 flex justify-center">
                    <div 
                      className="bg-white shadow-sm w-full max-w-[210mm] p-[15mm] text-slate-900 leading-relaxed text-justify text-sm md:text-base pointer-events-none select-none"
                      dangerouslySetInnerHTML={{ __html: auth.onboardingNDA.content }}
                    />
                 </div>
                 <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-4 items-center">
                    <Button variant="secondary" onClick={() => window.print()}>
                       <Download className="w-4 h-4 mr-2" /> Imprimir / PDF
                    </Button>
                    <Button onClick={() => setIsSigningNDA(true)} className="bg-amber-600 hover:bg-amber-700">
                       <CheckCircle className="w-4 h-4 mr-2" /> Li e Concordo - Assinar
                    </Button>
                 </div>
              </div>
           </div>
        </main>

        {/* NDA Signature Modal */}
        <Modal isOpen={isSigningNDA} onClose={() => setIsSigningNDA(false)} title="Assinar Termo de Confidencialidade">
          <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded text-amber-800 text-sm">
                  Declaro que li o documento na íntegra e concordo com todas as cláusulas de confidencialidade estabelecidas.
              </div>
              <Input 
                label="Digite seu nome completo para assinar" 
                value={ndaSignName} 
                onChange={(e) => setNdaSignName(e.target.value)} 
                placeholder="Ex: João da Silva" 
              />
              
              <div className="flex justify-end pt-4 gap-2">
                  <Button variant="ghost" onClick={() => setIsSigningNDA(false)}>Cancelar</Button>
                  <Button onClick={handleNDASignature} disabled={!ndaSignName || ndaSignName.length < 5}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Assinar Digitalmente
                  </Button>
              </div>
          </div>
        </Modal>

        <footer className="py-4 text-center text-xs text-slate-400">
           <p>Produzido por <button onClick={() => setShowExitoPage(true)} className="text-teal-700 font-bold hover:underline focus:outline-none">Êxito Comunicação e Marketing</button></p>
        </footer>
      </div>
    );
  }

  // PRESENTATION WALL (After NDA)
  if (auth.role === 'client' && auth.showPresentation) {
    return (
      <Presentation 
        clientName={auth.clientName || 'Cliente'} 
        htmlContent={auth.clientPresentationHtml}
        onContinue={handlePresentationContinue} 
        onShowCredits={() => setShowExitoPage(true)}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard role={auth.role} clientId={auth.clientId} />;
      case 'clients': 
        return <Clients role={auth.role} clientId={auth.clientId} />;
      case 'documents': 
        return <Documents role={auth.role} clientId={auth.clientId} />;
      case 'checklist':
        return <DiagnosticChecklist role={auth.role} clientId={auth.clientId} clientName={auth.clientName} />;
      case 'audit': 
        return auth.role === 'admin' ? <AuditLog /> : <Dashboard role={auth.role} clientId={auth.clientId} />;
      case 'proposal':
        return (
          <Presentation 
            clientName={auth.clientName || 'Cliente'} 
            htmlContent={auth.clientPresentationHtml}
            onContinue={() => setActiveTab('dashboard')} 
            onShowCredits={() => setShowExitoPage(true)}
            buttonText="Voltar ao Dashboard"
            embedded={true}
          />
        );
      default: 
        return <Dashboard role={auth.role} clientId={auth.clientId} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      role={auth.role} 
      clientName={auth.clientName}
      onLogout={() => setAuth({ role: null })}
      onShowCredits={() => setShowExitoPage(true)}
    >
      {renderContent()}
    </Layout>
  );
}
