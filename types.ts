

export type ClientStatus = 'active' | 'inactive' | 'prospect';

export interface Company {
  id: string;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  uf: string;
  isMatriz: boolean;
  parentId?: string; // If it's a subsidiary
}

export interface Client {
  id: string;
  password?: string; // Added for authentication
  mainCompany: Company;
  subsidiaries: Company[];
  outrasEmpresasConglomerado: string; // Text field for others
  representanteNome: string;
  representanteCpf: string;
  representanteCargo: string;
  email: string;
  telefone: string;
  cidadeForo: string;
  status: ClientStatus;
  createdAt: string;
  presentationHtml?: string; // HTML content for Value Proposition
}

export interface Template {
  id: string;
  title: string;
  category: 'nda' | 'proposal' | 'checklist' | 'minutes' | 'report' | 'other';
  content: string; // HTML or Markdown
  lastModified: string;
}

export type DocumentStatus = 'draft' | 'pending_signature' | 'signed' | 'archived';

export interface Document {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  templateId?: string;
  content: string;
  status: DocumentStatus;
  createdAt: string;
  signedAt?: string;
  signedBy?: string;
  signedIp?: string;
  signatureHash?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string; // 'Consultora' or 'Cliente'
  ip: string;
}

export interface Placeholder {
  key: string;
  label: string;
  description: string;
}

// --- NEW DIAGNOSTIC CHECKLIST TYPES ---

export interface DiagnosticData {
  // Stage 1 - Pre-Visit (Client)
  general?: {
    razaoSocial?: string;
    cnpj?: string;
    endereco?: string;
    responsavelInfo?: string;
    contato?: string;
    outrasEmpresas?: string;
  };
  structure?: {
    hasOrganograma?: string; // 'sim' | 'nao'
    totalClt?: string;
    totalIntermitentes?: string;
    totalAprendizes?: string;
    totalEstagiarios?: string;
    totalVigilantes?: string;
    totalPorteiros?: string;
    totalGerais?: string;
    totalAdm?: string;
    postosAtivos?: string;
  };
  recruitment?: {
    sources?: string[]; // checkboxes
    hasPsicotecnico?: string;
    hasTesteFisico?: string;
    tempoMedioVaga?: string;
    taxaAprovacao?: string;
  };
  dpInterno?: {
    tipoFolha?: string; // 'interna' | 'terceirizada'
    sistemaFolha?: string;
    tipoPonto?: string;
    tipoEscala?: string;
    gestaoBeneficios?: string;
    controlaReciclagem?: string;
  };
  cargosSalarios?: {
    hasPlano?: string;
    segueConvencao?: string;
    politicaPromocao?: string;
  };
  sst?: {
    tipoSst?: string;
    controleAsos?: string;
    fichaEpi?: string;
    hasCipa?: string;
    monitoramentoAfastamento?: string;
    taxaAcidentes?: string;
  };
  relacoes?: {
    turnover?: string;
    absenteismo?: string;
    hasProcessos?: string;
    motivosProcessos?: string;
  };
  tech?: {
    sistemaPonto?: string;
    sistemaFolha?: string; // Redundant but in questionnaire
    comunicacaoBase?: string;
  };

  // Stage 2 - Field Visit (Consultant)
  audit?: {
    estruturaOperacional?: string;
    analiseTecnicaDP?: string;
    docObrigatoria?: string;
    sst?: string;
    juridico?: string;
    revisaoTecnologica?: string;
    mapeamentoFluxos?: string;
    diagnosticoInicial?: string;
  };
}

export interface DiagnosticChecklist {
  id: string;
  clientId: string;
  lastUpdated: string;
  updatedBy: string; // user name
  data: DiagnosticData;
}