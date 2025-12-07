
import React from 'react';
import { ArrowLeft, Star, TrendingUp, Cpu, MapPin, CheckCircle, User, Award, LayoutGrid, Zap } from 'lucide-react';
import { Button } from './ui/UI';

interface ExitoPageProps {
  onBack: () => void;
}

export const ExitoPage: React.FC<ExitoPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-teal-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-teal-900/50">Ê</div>
             <div>
               <h1 className="font-bold text-white leading-none tracking-wide">ÊXITO</h1>
               <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Comunicação & Marketing</p>
             </div>
          </div>
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-slate-800 border-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/30 via-slate-950 to-slate-950"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/30 border border-teal-800 text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
            <Zap className="w-3 h-3" /> Agência de Performance
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Estratégia. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Inteligência.</span> Resultado.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A agência de Bataguassu especializada em consultoria estratégica, marketing de performance e soluções avançadas em Inteligência Artificial.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">
        
        {/* Section 1: Quem Somos & Diferencial */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-teal-500 pl-4">Quem Somos</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Atuamos com foco absoluto em potencializar negócios locais, transformando dados, tecnologia e comunicação em crescimento real.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-teal-700 transition-colors">
                 <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Cpu className="w-5 h-5 text-teal-500"/> IA a serviço do negócio</h3>
                 <p className="text-sm text-slate-400">Automações, análise comportamental e otimização de conteúdo.</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-teal-700 transition-colors">
                 <h3 className="font-bold text-white mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-teal-500"/> Foco total em Bataguassu</h3>
                 <p className="text-sm text-slate-400">Conhecimento profundo do mercado, público e comportamento local.</p>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-teal-500/10 blur-xl rounded-full"></div>
             <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <h3 className="text-teal-400 font-bold uppercase tracking-widest text-sm mb-6">Nosso Diferencial</h3>
                <ul className="space-y-4">
                  {[
                    "Estratégia acima de estética",
                    "Execução rápida e técnica",
                    "Orientação total a resultados",
                    "Método validado no mercado"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-teal-600" /> {item}
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </section>

        {/* Section 2: Case Bataguassu Tem */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-6 text-teal-400 font-bold uppercase tracking-wider text-xs">
               <Star className="w-4 h-4 fill-teal-400" /> Case de Sucesso
             </div>
             <h2 className="text-4xl font-bold text-white mb-4">Bataguassu Tem</h2>
             <p className="text-lg text-slate-300 mb-8 max-w-3xl">
               Criado e desenvolvido pela Êxito, é hoje o <strong>maior buscador regional</strong> de produtos e serviços do interior do Brasil, com foco exclusivo em Bataguassu.
             </p>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {['Negócios', 'Eventos', 'Serviços', 'Promoções'].map(tag => (
                  <div key={tag} className="bg-slate-950/50 p-3 rounded text-center text-slate-300 text-sm font-medium border border-slate-700">
                    {tag}
                  </div>
                ))}
             </div>
             <p className="text-sm text-slate-400 italic">
               "O maior case da cidade e um dos maiores do MS em alcance orgânico local."
             </p>
          </div>
        </section>

        {/* Section 3: Thiago Profile */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <div className="bg-slate-100 rounded-2xl p-2 h-full">
                <div className="bg-slate-200 h-full rounded-xl overflow-hidden relative min-h-[300px] flex items-end">
                   {/* Placeholder for Photo */}
                   <div className="w-full h-full absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-400">
                      <User className="w-24 h-24 opacity-20" />
                   </div>
                   <div className="relative z-10 p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                     <h3 className="text-white font-bold text-xl">Thiago Zielasko</h3>
                     <p className="text-teal-400 text-sm">CEO & Estrategista</p>
                   </div>
                </div>
             </div>
          </div>
          <div className="md:col-span-2 space-y-8">
             <div>
               <h2 className="text-3xl font-bold text-white mb-4">Liderança Técnica</h2>
               <p className="text-slate-400 mb-6">
                 Jornalista e marketólogo com mais de 15 anos de experiência em comunicação, marketing, social media, trade e gestão pública.
               </p>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-6">
               <div className="space-y-4">
                 <h4 className="text-white font-bold flex items-center gap-2"><Award className="w-5 h-5 text-purple-500" /> Formação Sólida</h4>
                 <ul className="text-sm text-slate-400 space-y-1">
                   <li>• Jornalista & Marketólogo</li>
                   <li>• Especializações em RH e Gestão</li>
                   <li>• Formação USP, FGV, CEPEF-MS</li>
                 </ul>
               </div>
               <div className="space-y-4">
                 <h4 className="text-white font-bold flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-blue-500" /> Pilares de Atuação</h4>
                 <ul className="text-sm text-slate-400 space-y-1">
                   <li>• Comunicação Estratégica</li>
                   <li>• Marketing e Criação</li>
                   <li>• Trade e Varejo</li>
                   <li>• Projetos e Gestão</li>
                 </ul>
               </div>
             </div>
          </div>
        </section>

        {/* Section 4: Serviços */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-12 text-center">O que fazemos</h2>
          <div className="grid md:grid-cols-4 gap-6">
             {[
               { title: "Consultoria", desc: "Diagnóstico, plano de comunicação e posicionamento de marca." },
               { title: "Marketing Digital", desc: "Social media, tráfego pago, captação de leads e automação." },
               { title: "Conteúdo", desc: "Identidade visual, copywriting, roteiros e branding." },
               { title: "Audiovisual", desc: "Spots, chamadas, vídeos de campanha e rádio indoor." }
             ].map((svc, i) => (
               <div key={i} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:-translate-y-1 transition-transform">
                 <h3 className="font-bold text-teal-400 mb-3">{svc.title}</h3>
                 <p className="text-sm text-slate-400">{svc.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center py-20 border-t border-slate-800">
           <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
             A agência que une experiência, estratégia e tecnologia.
           </h2>
           <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
             Foco total em um único objetivo: entregar resultado real para Bataguassu e para quem empreende aqui.
           </p>
           <div className="flex justify-center gap-4">
              <Button onClick={onBack} size="lg" className="bg-teal-600 hover:bg-teal-700 text-white border-0">
                Voltar ao Sistema
              </Button>
           </div>
        </section>

      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-slate-600 text-xs">
        &copy; {new Date().getFullYear()} Êxito Comunicação e Marketing. Todos os direitos reservados.
      </footer>
    </div>
  );
};
