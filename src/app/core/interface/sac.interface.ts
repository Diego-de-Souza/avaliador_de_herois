export interface SACContact {
  id: number;
  ticket_number: string;
  usuario_id: number;
  type: SACType;
  subject: string;
  message: string;
  priority: SACPriority;
  status: SACStatus;
  attachments?: SACAttachment[];
  created_at: string;
  updated_at: string;
  responses?: SACResponse[];
}

export type SACType = 'suporte' | 'reclamacao' | 'elogio';
export type SACPriority = 'low' | 'normal' | 'high' | 'urgent';
export type SACStatus = 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';

export interface SACAttachment {
  id: number;
  contact_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface SACResponse {
  id: number;
  contact_id: number;
  message: string;
  author: string;
  attachments?: SACAttachment[];
  created_at: string;
}

export interface SACContactRequest {
  usuario_id: number;
  type: SACType;
  subject: string;
  message: string;
  priority?: SACPriority;
  attachments?: File[];
}

export interface SACApiResponse {
  status: number;
  message: string;
  data: SACContact[];
  dataUnit?: SACContact;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SACFilters {
  type?: SACType;
  status?: SACStatus;
  priority?: SACPriority;
  search?: string;
  usuario_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}
