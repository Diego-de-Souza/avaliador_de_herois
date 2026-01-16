import { ListItem } from './articles.interface';

export interface ClientArticleRequest {
  category: string;
  title: string;
  description: string;
  text: string;
  summary: ListItem[];
  keyWords: string[];
  theme?: string;
  themeColor?: string;
  usuario_id: number;
}

export interface ClientArticle extends ClientArticleRequest {
  id: number;
  created_at?: string;
  updated_at?: string;
  views?: number;
  thumbnail?: string;
  image?: string;
  route?: string;
  author?: string;
}

export interface ClientArticleListResponse {
  articles: ClientArticle[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ClientArticleApiResponse {
  status: number;
  message: string;
  data: ClientArticle[];
}
