
import { Client, Template, Placeholder } from './types';

// Consultoria Info
export const CONSULTORIA_INFO = {
  nome: 'Borges Consultoria',
  consultora: 'Danieli Borges de Lima',
  cpf: '012.926.211-09',
  endereco: 'Rua Nova Andradina, 683 – Bataguassu/MS',
  telefone: '(67) 92001-5785',
  email: 'contato@borgesconsultoria.com.br' // Placeholder email
};

// Initial Data
export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    password: '478431', // Password = First 6 digits of CNPJ (47.843.155...)
    status: 'active',
    createdAt: new Date().toISOString(),
    representanteNome: 'João Nascimento',
    representanteCpf: '123.456.789-00',
    representanteCargo: 'Sócio-Administrador',
    email: 'financeiro@nascimentoseguranca.com.br',
    telefone: '(67) 99999-9999',
    cidadeForo: 'Bataguassu',
    mainCompany: {
      id: 'c1',
      razaoSocial: 'Nascimento Segurança e Vigilância Ltda',
      cnpj: '47.843.155/0001-53',
      endereco: 'Bataguassu/MS',
      cidade: 'Bataguassu',
      uf: 'MS',
      isMatriz: true
    },
    subsidiaries: [
      {
        id: 'c2',
        razaoSocial: 'Baruc Amos Nascimento & Nascimento Monitoramento Ltda',
        cnpj: '00.000.000/0001-00', // Mock
        endereco: 'Avenida Cuiabá, 261 – Centro – Bataguassu/MS',
        cidade: 'Bataguassu',
        uf: 'MS',
        isMatriz: false,
        parentId: 'c1'
      }
    ],
    outrasEmpresasConglomerado: 'Nascimento Transporte de Valores, Grupo Alpha Segurança.',
    presentationHtml: `
      <div class="space-y-12 text-slate-800 font-sans">
        
        <!-- Section 1: Context -->
        <div class="bg-slate-50 p-8 rounded-2xl border border-slate-200">
          <h3 class="text-teal-800 font-bold uppercase tracking-widest text-sm mb-6 border-b border-teal-200 pb-2">1. O Contexto Real do Seu Setor</h3>
          <p class="mb-4 text-lg leading-relaxed">
            Empresas de segurança e serviços operam em um ambiente extremamente sensível, competitivo e regulamentado. Lidam diariamente com:
          </p>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <li class="flex items-start gap-3"><span class="text-red-500 font-bold text-xl">⚠️</span> <span>Rotatividade elevada de vigilantes e porteiros.</span></li>
            <li class="flex items-start gap-3"><span class="text-red-500 font-bold text-xl">⚠️</span> <span>Escalas 12x36, 5x2 e operações que não podem falhar.</span></li>
            <li class="flex items-start gap-3"><span class="text-red-500 font-bold text-xl">⚠️</span> <span>Fiscalização crescente do Ministério do Trabalho, sindicatos e eSocial.</span></li>
            <li class="flex items-start gap-3"><span class="text-red-500 font-bold text-xl">⚠️</span> <span>Riscos jurídicos que podem levar a passivos milionários.</span></li>
          </ul>
          <p class="mt-6 font-semibold text-slate-700 border-l-4 border-teal-500 pl-4 italic">
            A soma desses fatores exige precisão técnica e controle rígido. É exatamente aqui que entramos.
          </p>
        </div>

        <!-- Section 2: Delivery (3 Pillars) -->
        <div>
          <h3 class="text-teal-800 font-bold uppercase tracking-widest text-sm mb-8 text-center">2. A Nossa Entrega: Solução Completa e Estratégica</h3>
          
          <div class="grid grid-cols-1 gap-8">
            <!-- Pilar 1 -->
            <div class="bg-white p-8 rounded-xl shadow-sm border-t-4 border-teal-600">
              <h4 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span class="bg-teal-100 text-teal-800 p-2 rounded text-sm">PILAR 1</span> Segurança Jurídica (Compliance Total)
              </h4>
              <div class="grid md:grid-cols-2 gap-8">
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase mb-2">Como aplicamos</p>
                  <ul class="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Auditoria minuciosa (admissão, ponto, férias).</li>
                    <li>Revisão de escalas (CLT, CCTs, NRs).</li>
                    <li>Conformidade com eSocial e FGTS Digital.</li>
                  </ul>
                </div>
                <div class="bg-teal-50 p-4 rounded-lg">
                  <p class="text-xs font-bold text-teal-700 uppercase mb-2">O que você ganha</p>
                  <ul class="space-y-2 text-sm text-slate-800 font-medium">
                    <li class="flex gap-2">✅ Redução real de passivos trabalhistas.</li>
                    <li class="flex gap-2">✅ Eliminação de multas.</li>
                    <li class="flex gap-2">✅ Tranquilidade jurídica.</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Pilar 2 -->
            <div class="bg-white p-8 rounded-xl shadow-sm border-t-4 border-blue-600">
              <h4 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span class="bg-blue-100 text-blue-800 p-2 rounded text-sm">PILAR 2</span> Eficiência Operacional
              </h4>
              <div class="grid md:grid-cols-2 gap-8">
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase mb-2">Como aplicamos</p>
                  <ul class="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Padronização e automação de rotinas.</li>
                    <li>Processos estruturados (Sistema Domínio).</li>
                    <li>Gestão precisa de folha e benefícios.</li>
                  </ul>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                  <p class="text-xs font-bold text-blue-700 uppercase mb-2">O que você ganha</p>
                  <ul class="space-y-2 text-sm text-slate-800 font-medium">
                    <li class="flex gap-2">⚡ Redução de custos administrativos.</li>
                    <li class="flex gap-2">⚡ Eliminação de erros manuais.</li>
                    <li class="flex gap-2">⚡ Operação mais leve e previsível.</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Pilar 3 -->
            <div class="bg-white p-8 rounded-xl shadow-sm border-t-4 border-purple-600">
              <h4 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span class="bg-purple-100 text-purple-800 p-2 rounded text-sm">PILAR 3</span> Gestão Estratégica de Pessoas
              </h4>
              <div class="grid md:grid-cols-2 gap-8">
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase mb-2">Como aplicamos</p>
                  <ul class="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Análise de indicadores (turnover, absenteísmo).</li>
                    <li>Políticas de cargos e salários.</li>
                    <li>Ações de retenção de vigilantes.</li>
                  </ul>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                  <p class="text-xs font-bold text-purple-700 uppercase mb-2">O que você ganha</p>
                  <ul class="space-y-2 text-sm text-slate-800 font-medium">
                    <li class="flex gap-2">📈 Redução consistente da rotatividade.</li>
                    <li class="flex gap-2">📈 Profissionais mais comprometidos.</li>
                    <li class="flex gap-2">📈 Melhoria na qualidade do serviço.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Commitment -->
        <div class="bg-slate-900 text-white p-8 rounded-2xl text-center">
          <h3 class="text-teal-400 font-bold uppercase tracking-widest text-sm mb-4">3. O Nosso Compromisso com Você</h3>
          <p class="text-lg font-light leading-relaxed max-w-3xl mx-auto mb-8">
            "Você terá um Departamento Pessoal estruturado, seguro, eficiente e que fortalece a operação — com o mesmo nível de profissionalismo e confiabilidade que seus clientes esperam dos seus serviços de segurança."
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
            <div class="border border-slate-700 p-3 rounded">Transparência Total</div>
            <div class="border border-slate-700 p-3 rounded">Sigilo Absoluto</div>
            <div class="border border-slate-700 p-3 rounded">Compromisso Técnico</div>
            <div class="border border-slate-700 p-3 rounded">Execução Precisa</div>
          </div>
        </div>

        <!-- Footer Profile -->
        <div class="flex items-center gap-4 pt-8 border-t border-slate-200">
           <div class="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 text-xl">DB</div>
           <div>
             <p className="font-bold text-slate-900">Danieli Borges</p>
             <p className="text-slate-500 text-sm">Consultora Sênior • Especialista em DP e Relações Trabalhistas</p>
             <p className="text-teal-700 text-sm font-medium">+15 anos de experiência no setor</p>
           </div>
        </div>
      </div>
    `
  }
];

export const NDA_TEMPLATE_TEXT = `
<h1 class="text-2xl font-bold text-center mb-4">ACORDO DE CONFIDENCIALIDADE (NDA)</h1>

<p class="mb-4"><strong>DAS PARTES:</strong></p>

<p class="mb-2"><strong>REVELADORA: {{CLIENTE_RAZAO_SOCIAL}}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{CLIENTE_CNPJ}}, com sede em {{CLIENTE_ENDERECO_COMPLETO}}, neste ato representada por {{CLIENTE_REPRESENTANTE_NOME}}, CPF {{CLIENTE_REPRESENTANTE_CPF}}.</p>

<p class="mb-4"><strong>RECEPTORA: {{CONSULTORA_NOME}}</strong>, inscrita no CPF sob o nº {{CONSULTORA_CPF}}, residente e domiciliada em {{CONSULTORA_ENDERECO}}, doravante denominada "CONSULTORA".</p>

<p class="mb-4">As partes acima identificadas têm, entre si, justo e acertado o presente Acordo de Confidencialidade, que se regerá pelas cláusulas seguintes:</p>

<h3 class="font-bold mt-4 mb-2">CLÁUSULA PRIMEIRA - DO OBJETO</h3>
<p class="mb-2">O presente instrumento tem por objeto a proteção de informações confidenciais disponibilizadas pela REVELADORA à RECEPTORA em razão da prestação de serviços de consultoria empresarial.</p>

<h3 class="font-bold mt-4 mb-2">CLÁUSULA SEGUNDA - DA CONFIDENCIALIDADE</h3>
<p class="mb-2">A RECEPTORA compromete-se a manter o mais absoluto sigilo sobre quaisquer dados, materiais, pormenores, informações, documentos, especificações técnicas ou comerciais, inovações e aperfeiçoamentos da REVELADORA que venha a ter acesso ou conhecimento, ou que lhe tenham sido confiados.</p>

<h3 class="font-bold mt-4 mb-2">CLÁUSULA TERCEIRA - DA LGPD</h3>
<p class="mb-2">As partes comprometem-se a tratar quaisquer dados pessoais envolvidos na execução deste contrato em estrita observância à Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>

<h3 class="font-bold mt-4 mb-2">CLÁUSULA QUARTA - DA VIGÊNCIA</h3>
<p class="mb-2">A obrigação de confidencialidade permanecerá vigente pelo prazo de 05 (cinco) anos após o término da relação comercial entre as partes.</p>

<h3 class="font-bold mt-4 mb-2">CLÁUSULA QUINTA - DO FORO</h3>
<p class="mb-4">Fica eleito o foro da Comarca de {{CLIENTE_CIDADE_FORO}} para dirimir quaisquer dúvidas oriundas deste contrato.</p>

<p class="mt-8 mb-4 text-center">E por estarem assim justos e contratados, assinam o presente instrumento.</p>

<p class="mt-4 text-center">{{CLIENTE_CIDADE}}, {{DATA_EXTENSO}}.</p>

<div class="mt-12 grid grid-cols-2 gap-8">
  <div class="border-t border-black pt-2 text-center">
    <strong>{{CLIENTE_RAZAO_SOCIAL}}</strong><br>
    {{CLIENTE_REPRESENTANTE_NOME}}
  </div>
  <div class="border-t border-black pt-2 text-center">
    <strong>DANIELI BORGES DE LIMA</strong><br>
    Consultora
  </div>
</div>
`;

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 't1',
    title: 'Termo de Confidencialidade (NDA)',
    category: 'nda',
    lastModified: new Date().toISOString(),
    content: NDA_TEMPLATE_TEXT
  },
  {
    id: 't2',
    title: 'Proposta de Consultoria',
    category: 'proposal',
    lastModified: new Date().toISOString(),
    content: `
      <h1 class="text-2xl font-bold mb-4">PROPOSTA DE CONSULTORIA</h1>
      <p>Aos cuidados de <strong>{{CLIENTE_REPRESENTANTE_NOME}}</strong>,</p>
      <p>A Borges Consultoria tem o prazer de apresentar a proposta técnica para a empresa <strong>{{CLIENTE_RAZAO_SOCIAL}}</strong>.</p>
      <h3 class="font-bold mt-4">Escopo do Trabalho</h3>
      <p>O trabalho consistirá no diagnóstico empresarial, mapeamento de processos e implementação de melhorias...</p>
      <p class="mt-8 text-center">{{CONSULTORA_NOME}} - {{CONSULTORA_TELEFONE}}</p>
    `
  },
  {
    id: 't3',
    title: 'Checklist de Primeira Visita',
    category: 'checklist',
    lastModified: new Date().toISOString(),
    content: `
      <h2 class="text-xl font-bold mb-4">CHECKLIST DIAGNÓSTICO INICIAL</h2>
      <p><strong>Cliente:</strong> {{CLIENTE_RAZAO_SOCIAL}}</p>
      <p><strong>Data:</strong> {{DATA_EXTENSO}}</p>
      <ul class="list-disc ml-6 mt-4 space-y-2">
        <li>[ ] Organograma atualizado?</li>
        <li>[ ] Definição de missão, visão e valores?</li>
        <li>[ ] Controles financeiros básicos (Fluxo de Caixa)?</li>
        <li>[ ] Cadastro de colaboradores completo?</li>
        <li>[ ] Licenças de funcionamento em dia?</li>
      </ul>
    `
  }
];

export const PLACEHOLDERS: Placeholder[] = [
  { key: '{{CONSULTORA_NOME}}', label: 'Nome Consultora', description: 'Danieli Borges de Lima' },
  { key: '{{CONSULTORA_CPF}}', label: 'CPF Consultora', description: 'CPF da consultora' },
  { key: '{{DATA_EXTENSO}}', label: 'Data Atual', description: 'Data formatada por extenso' },
  { key: '{{CLIENTE_RAZAO_SOCIAL}}', label: 'Razão Social', description: 'Nome da empresa cliente' },
  { key: '{{CLIENTE_CNPJ}}', label: 'CNPJ', description: 'CNPJ do cliente' },
  { key: '{{CLIENTE_ENDERECO_COMPLETO}}', label: 'Endereço Completo', description: 'Endereço da matriz' },
  { key: '{{CLIENTE_REPRESENTANTE_NOME}}', label: 'Representante', description: 'Nome do representante legal' },
  { key: '{{CLIENTE_LISTA_OUTRAS_EMPRESAS}}', label: 'Outras Empresas', description: 'Lista de empresas do conglomerado' },
];
