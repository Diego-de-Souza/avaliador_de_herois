export interface ClientNewsRequest {
  title: string;
  description: string;
  content: string;
  type_news_letter: string;
  theme: string;
  usuario_id: number;
}

export interface ClientNews extends ClientNewsRequest {
  id: number;
  created_at?: string;
  updated_at?: string;
  views?: number;
  thumbnail?: string;
  image?: string;
  author?: string;
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
