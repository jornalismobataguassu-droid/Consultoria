
import React from 'react';
import { Button, Card } from './ui/UI';
import { ShieldCheck, Zap, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

interface PresentationProps {
  clientName: string;
  htmlContent?: string;
  onContinue: () => void;
  onShowCredits?: () => void;
  buttonText?: string;
  embedded?: boolean;
}

export const Presentation: React.FC<PresentationProps> = ({ clientName, htmlContent, onContinue, onShowCredits, buttonText, embedded }) => {
  const btnLabel = buttonText || "Acessar Portal & Gerar Contratos";
  
  // If HTML content is provided (Custom Proposal), render it
  if (htmlContent) {
    return (
      <div className={`min-h-screen bg-slate-50 font-sans flex flex-col ${embedded ? 'min-h-0' : ''}`}>
        <header className="bg-teal-900 text-white py-12 px-6 shadow-lg relative overflow-hidden rounded-t-3xl md:rounded-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-teal-700/50 pb-8 mb-8">
               <div>
                 <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">DB BORGES CONSULTORIA</h1>
                 <p className="text-teal-200 text-lg md:text-xl font-light">Parceria Estratégica em Gestão de Pessoas</p>
               </div>
               <div className="text-left md:text-right">
                 <p className="uppercase tracking-wider text-xs font-semibold opacity-70">Apresentado para</p>
                 <p className="text-xl md:text-2xl font-bold text-white">{clientName}</p>
                 <p className="mt-1 opacity-80 text-sm">{new Date().toLocaleDateString('pt-BR')}</p>
               </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-light leading-relaxed max-w-4xl text-white">
              Sua operação segura, eficiente e estratégica.
            </h2>
          </div>
        </header>

        <main className={`flex-1 py-12 px-4 md:px-8 ${embedded ? 'bg-white' : ''}`}>
          <div className={`max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] border border-slate-100 ${embedded ? 'shadow-none border-0' : ''}`}>
             <div className="p-8 md:p-12">
               <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
             </div>
             
             <div className="bg-slate-50 p-8 md:p-12 text-center border-t border-slate-100">
               <div className="max-w-lg mx-auto">
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">Pronto para transformar sua gestão?</h3>
                 {!embedded && (
                   <p className="text-slate-600 mb-8">
                     Ao acessar o portal, esta proposta será salva automaticamente em sua biblioteca de documentos.
                   </p>
                 )}
                 <Button size="lg" onClick={onContinue} className="shadow-xl shadow-teal-900/20 text-lg px-8 py-6 h-auto w-full md:w-auto animate-pulse hover:animate-none">
                    {btnLabel} <ArrowRight className="w-5 h-5 ml-2" />
                 </Button>
               </div>
             </div>
          </div>
        </main>

        {!embedded && (
          <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs">
            <p>Produzido por <button onClick={onShowCredits} className="text-white font-bold hover:underline focus:outline-none">Êxito Comunicação e Marketing</button></p>
          </footer>
        )}
      </div>
    );
  }

  // Fallback to default layout if no HTML provided
  return (
    <div className={`min-h-screen bg-slate-50 font-sans flex flex-col ${embedded ? 'min-h-0' : ''}`}>
      <header className="bg-teal-900 text-white py-12 px-6 rounded-t-3xl md:rounded-none">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-teal-700/50 pb-8 mb-8">
             <div>
               <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">DB BORGES CONSULTORIA</h1>
               <p className="text-teal-200 text-lg">Parceria Estratégica para Empresas de Segurança e Serviços</p>
             </div>
             <div className="text-left md:text-right opacity-80 text-sm">
               <p className="uppercase tracking-wider font-semibold">Preparado para</p>
               <p className="text-xl font-bold text-white">{clientName}</p>
               <p className="mt-1">{new Date().toLocaleDateString('pt-BR')}</p>
             </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-light leading-relaxed max-w-3xl">
            Proposta de Valor: Transformando gestão de pessoas em vantagem competitiva.
          </h2>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-teal-700 font-bold uppercase tracking-widest text-sm mb-4">O Seu Desafio</h3>
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light">
              "Entendemos os desafios únicos do setor de segurança e vigilância: a <strong className="text-slate-900 font-semibold">alta rotatividade</strong> de pessoal, a complexidade da gestão de escalas e jornadas, a pressão por custos e a necessidade absoluta de conformidade legal."
            </p>
          </div>
        </section>
        <section className="py-20 px-6 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
             <Button size="lg" onClick={onContinue} className="shadow-xl shadow-teal-900/20 text-lg px-8 py-6 h-auto">
                 {embedded ? 'Voltar ao Dashboard' : 'Acessar Portal do Cliente'} <ArrowRight className="w-5 h-5 ml-2" />
             </Button>
          </div>
        </section>
      </main>

       {!embedded && (
         <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs">
            <p>Produzido por <button onClick={onShowCredits} className="text-white font-bold hover:underline focus:outline-none">Êxito Comunicação e Marketing</button></p>
          </footer>
       )}
    </div>
  );
};
