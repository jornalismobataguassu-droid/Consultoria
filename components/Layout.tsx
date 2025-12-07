
import React from 'react';
import { LayoutDashboard, Users, FileText, History, Menu, LogOut, Building, Sparkles, ClipboardList } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: 'admin' | 'client';
  clientName?: string;
  onLogout: () => void;
  onShowCredits?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, role, clientName, onLogout, onShowCredits }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes & Conglomerados', icon: Users },
    { id: 'checklist', label: 'Checklist Diagnóstico', icon: ClipboardList },
    { id: 'documents', label: 'Biblioteca de Documentos', icon: FileText },
    { id: 'audit', label: 'Audit Log', icon: History },
  ];

  const clientMenu = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'proposal', label: 'Proposta de Valor', icon: Sparkles },
    { id: 'checklist', label: 'Checklist Diagnóstico', icon: ClipboardList },
    { id: 'documents', label: 'Meus Documentos', icon: FileText },
    { id: 'clients', label: 'Minha Empresa', icon: Building },
  ];

  const menuItems = role === 'admin' ? adminMenu : clientMenu;

  const handleNav = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <div className={`md:hidden ${role === 'admin' ? 'bg-teal-900' : 'bg-blue-900'} text-white p-4 flex justify-between items-center shadow-md`}>
        <span className="font-bold text-lg tracking-wide">BORGES CONSULTORIA</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className={`p-6 border-b border-slate-700 ${role === 'admin' ? 'bg-teal-900/50' : 'bg-blue-900/50'}`}>
          <div className="flex items-center gap-3">
             <div className={`w-8 h-8 rounded-lg ${role === 'admin' ? 'bg-teal-500' : 'bg-blue-500'} flex items-center justify-center font-bold text-white`}>
               {role === 'admin' ? 'B' : 'C'}
             </div>
             <div>
               <h1 className="font-bold text-sm tracking-wide">BORGES CONSULTORIA</h1>
               <p className="text-xs text-slate-400">{role === 'admin' ? 'Painel Administrativo' : 'Portal do Cliente'}</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? (role === 'admin' ? 'bg-teal-700 text-white shadow-lg shadow-teal-900/20' : 'bg-blue-700 text-white shadow-lg shadow-blue-900/20')
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              {role === 'admin' ? 'DB' : 'CL'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{role === 'admin' ? 'Danieli Borges' : clientName}</p>
              <p className="text-xs text-slate-500 truncate">{role === 'admin' ? 'Consultora Master' : 'Acesso Cliente'}</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {children}
          </div>
        </div>

        {/* Mandatory Fixed Footer */}
        <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sticky bottom-0 z-30">
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
            Produzido por <button onClick={onShowCredits} className="text-teal-700 font-bold hover:underline focus:outline-none">Êxito Comunicação e Marketing</button>
          </p>
        </footer>
      </main>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
