/** Item de notícia exibido na página de newsletter */
export interface NewsletterNewsItem {
  id?: string | null;
  title: string;
  description: string;
  image: string;
  link: string;
  category?: string;
  date?: string;
  read_time?: string;
  author?: string;
  usuario_id?: string ;
}

/** Request para criar/atualizar item de newsletter (admin) */
export interface NewsletterItemRequest {
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  date: string;
  read_time: string;
  author: string;
  usuario_id: string;
}

export interface ClientNewsRequest {
  title: string;
  description: string;
  image?: string;
  link?: string;
  category: string;
  date: string;
  read_time: string;
  author: string;
  usuario_id: string;
}

export interface ClientNews extends Omit<ClientNewsRequest, 'usuario_id'> {
  id: string;
  usuario_id?: string;
  created_at?: string;
  updated_at?: string;
  views?: number;
  thumbnail?: string;
}

export interface ClientNewsListResponse {
  news: ClientNews[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ClientNewsApiResponse {
  status: number;
  message: string;
  data: ClientNews[];
}

export interface NewsletterListResponse {
  data?: NewsletterNewsItem[];
  news?: NewsletterNewsItem[];
  status?: number;
  message?: string;
}