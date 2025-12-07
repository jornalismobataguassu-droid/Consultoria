
import { Client, Document, Template, AuditLogEntry, DiagnosticChecklist, DiagnosticData } from '../types';
import { INITIAL_CLIENTS, INITIAL_TEMPLATES, CONSULTORIA_INFO } from '../constants';

const STORAGE_KEYS = {
  CLIENTS: 'borges_clients',
  DOCUMENTS: 'borges_documents',
  TEMPLATES: 'borges_templates',
  LOGS: 'borges_logs',
  CHECKLISTS: 'borges_checklists',
};

// Helper to get from local storage or default
const get = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

const set = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const backend = {
  // Clients
  getClients: (): Client[] => get(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS),
  saveClient: (client: Client) => {
    const clients = backend.getClients();
    const existingIndex = clients.findIndex(c => c.id === client.id);
    if (existingIndex >= 0) {
      clients[existingIndex] = client;
    } else {
      clients.push(client);
    }
    set(STORAGE_KEYS.CLIENTS, clients);
    backend.logAudit('CLIENT_UPDATE', `Cliente ${client.mainCompany.razaoSocial} atualizado/criado.`);
  },

  // Auth Helper
  verifyClientPassword: (clientId: string, password: string): boolean => {
    const clients = backend.getClients();
    const client = clients.find(c => c.id === clientId);
    // Simple verification (in prod use hashing)
    return client ? client.password === password : false;
  },

  // Authenticate by CNPJ (sanitized) and Password
  authenticateClientByCnpj: (cnpjInput: string, passwordInput: string): Client | null => {
    const clients = backend.getClients();
    // Remove non-numeric characters for flexible matching
    const cleanCnpjInput = cnpjInput.replace(/\D/g, '');
    
    const client = clients.find(c => c.mainCompany.cnpj.replace(/\D/g, '') === cleanCnpjInput);
    
    if (client && client.password === passwordInput) {
      return client;
    }
    return null;
  },

  // Templates
  getTemplates: (): Template[] => get(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES),
  saveTemplate: (template: Template) => {
    const templates = backend.getTemplates();
    const idx = templates.findIndex(t => t.id === template.id);
    if (idx >= 0) templates[idx] = template;
    else templates.push(template);
    set(STORAGE_KEYS.TEMPLATES, templates);
  },

  // Documents
  getDocuments: (): Document[] => get(STORAGE_KEYS.DOCUMENTS, []),
  saveDocument: (doc: Document) => {
    const docs = backend.getDocuments();
    const idx = docs.findIndex(d => d.id === doc.id);
    if (idx >= 0) docs[idx] = doc;
    else docs.push(doc);
    set(STORAGE_KEYS.DOCUMENTS, docs);
    backend.logAudit('DOC_SAVE', `Documento ${doc.title} salvo.`);
  },

  // Generate Proposal PDF Document
  generateProposalDocument: (clientId: string) => {
    const docs = backend.getDocuments();
    const clients = backend.getClients();
    const client = clients.find(c => c.id === clientId);
    
    if (!client || !client.presentationHtml) return;

    // Check if already exists to avoid duplicates
    const exists = docs.find(d => d.clientId === clientId && d.title === 'Proposta de Valor - Parceria Estratégica');
    if (exists) return;

    // Wrap the presentation HTML in a document header
    const fullContent = `
      <div style="font-family: sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #0f766e;">
           <h1 style="font-size: 24px; font-weight: bold; color: #0f766e; margin: 0;">PROPOSTA DE VALOR & PARCERIA</h1>
           <p style="font-size: 14px; color: #666; margin-top: 5px;">Borges Consultoria • ${new Date().toLocaleDateString()}</p>
        </div>
        ${client.presentationHtml}
      </div>
    `;

    const newDoc: Document = {
      id: `prop-${clientId}-${Date.now()}`,
      title: 'Proposta de Valor - Parceria Estratégica',
      clientId: client.id,
      clientName: client.mainCompany.razaoSocial,
      content: fullContent,
      status: 'signed', // Auto-considered delivered/signed by consultant
      createdAt: new Date().toISOString(),
      signedAt: new Date().toISOString(),
      signedBy: 'Danieli Borges (Envio Automático)',
    };

    backend.saveDocument(newDoc);
    backend.logAudit('PROPOSAL_GEN', `Proposta gerada para ${client.mainCompany.razaoSocial}`, 'Sistema');
  },

  // Special method to ensure NDA exists and return it
  getOrProvisionNDA: (clientId: string): Document | null => {
    const docs = backend.getDocuments();
    const templates = backend.getTemplates();
    const clients = backend.getClients();
    const client = clients.find(c => c.id === clientId);
    
    if (!client) return null;

    // Check if NDA already exists
    const existingNDA = docs.find(d => d.clientId === clientId && d.title.includes('NDA'));
    if (existingNDA) return existingNDA;

    // If not, provision it
    const ndaTemplate = templates.find(t => t.category === 'nda');
    if (!ndaTemplate) return null; // Should not happen

    let content = backend.processPlaceholders(ndaTemplate.content, client);
    
    // Simulate Consultant's Signature
    const consultantSignature = `
      <div style="margin-top: 40px; padding: 15px; background-color: #f0fdf4; border: 1px solid #10b981; border-radius: 8px; font-family: sans-serif; font-size: 11px; color: #064e3b;">
        <p style="font-weight: bold; margin-bottom: 4px;">✅ ASSINADO DIGITALMENTE PELA CONSULTORA</p>
        <p><strong>Nome:</strong> ${CONSULTORIA_INFO.consultora}</p>
        <p><strong>CPF:</strong> ${CONSULTORIA_INFO.cpf}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>IP:</strong> 177.200.10.55</p>
        <p><strong>Hash Autenticidade:</strong> ${Math.random().toString(36).substr(2, 20).toUpperCase()}</p>
      </div>
    `;
    
    content += consultantSignature;

    const newNDA: Document = {
      id: `nda-${clientId}-${Date.now()}`,
      title: 'Termo de Confidencialidade (NDA)',
      clientId: client.id,
      clientName: client.mainCompany.razaoSocial,
      templateId: ndaTemplate.id,
      content: content,
      status: 'pending_signature', // Waiting for client
      createdAt: new Date().toISOString()
    };

    backend.saveDocument(newNDA);
    return newNDA;
  },

  // Checklists
  getChecklist: (clientId: string): DiagnosticChecklist => {
    const checklists: DiagnosticChecklist[] = get(STORAGE_KEYS.CHECKLISTS, []);
    const found = checklists.find(c => c.clientId === clientId);
    if (found) return found;

    // Return empty structure if new
    return {
      id: `chk-${clientId}`,
      clientId,
      lastUpdated: '',
      updatedBy: '',
      data: {}
    };
  },

  saveChecklist: (checklist: DiagnosticChecklist) => {
    const checklists: DiagnosticChecklist[] = get(STORAGE_KEYS.CHECKLISTS, []);
    const idx = checklists.findIndex(c => c.clientId === checklist.clientId);
    if (idx >= 0) checklists[idx] = checklist;
    else checklists.push(checklist);
    set(STORAGE_KEYS.CHECKLISTS, checklists);
    backend.logAudit('CHECKLIST_UPDATE', `Checklist de Diagnóstico atualizado.`, checklist.updatedBy);
  },
  
  // Audit Logs
  getLogs: (): AuditLogEntry[] => get(STORAGE_KEYS.LOGS, []),
  logAudit: (action: string, details: string, user: string = 'Consultora') => {
    const logs = backend.getLogs();
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details,
      user,
      ip: '192.168.1.' + Math.floor(Math.random() * 255) // Simulated IP
    };
    logs.unshift(newLog); // Newest first
    set(STORAGE_KEYS.LOGS, logs);
  },

  // Logic: Parse Placeholders
  processPlaceholders: (content: string, client: Client): string => {
    let processed = content;
    const now = new Date();
    const dataExtenso = now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

    const replacements: Record<string, string> = {
      '{{CONSULTORA_NOME}}': CONSULTORIA_INFO.consultora,
      '{{CONSULTORA_CPF}}': CONSULTORIA_INFO.cpf,
      '{{CONSULTORA_ENDERECO}}': CONSULTORIA_INFO.endereco,
      '{{CONSULTORA_TELEFONE}}': CONSULTORIA_INFO.telefone,
      '{{CONSULTORA_EMAIL}}': CONSULTORIA_INFO.email,
      '{{DATA_EXTENSO}}': dataExtenso,
      '{{CLIENTE_RAZAO_SOCIAL}}': client.mainCompany.razaoSocial,
      '{{CLIENTE_CNPJ}}': client.mainCompany.cnpj,
      '{{CLIENTE_ENDERECO_COMPLETO}}': `${client.mainCompany.endereco} - ${client.mainCompany.cidade}/${client.mainCompany.uf}`,
      '{{CLIENTE_REPRESENTANTE_NOME}}': client.representanteNome,
      '{{CLIENTE_REPRESENTANTE_CPF}}': client.representanteCpf,
      '{{CLIENTE_REPRESENTANTE_CARGO}}': client.representanteCargo,
      '{{CLIENTE_CIDADE}}': client.mainCompany.cidade,
      '{{CLIENTE_UF}}': client.mainCompany.uf,
      '{{CLIENTE_CIDADE_FORO}}': client.cidadeForo,
      '{{CLIENTE_EMAIL}}': client.email,
      '{{CLIENTE_TELEFONE}}': client.telefone,
      '{{CLIENTE_LISTA_OUTRAS_EMPRESAS}}': client.outrasEmpresasConglomerado || 'N/A',
    };

    Object.entries(replacements).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(key, 'g'), value);
    });

    return processed;
  }
};
