import { inject, Injectable } from '@angular/core';
import { articlesProps } from '../../interface/articles.interface';
import { articlesDataBase } from '../../../data/articles';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ArticleHttpService } from '../http/article-http.service';
import { ClientArticle, ClientArticleListResponse, ClientArticleRequest } from '../../interface/client-article.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly http = inject(HttpClient);
  private readonly articleHttpService = inject(ArticleHttpService)

  // // Buscar todos artigos
  // getArticles(): Observable<Article[]> {
  //   return this.http.get<Article[]>(this.apiUrl);
  // }

  // Buscar artigo por ID
  getArticleById(id: string): Observable<String[]> {
    return this.articleHttpService.getArticleById(id);
  }

  // Criar artigo
  createArticle(article: articlesProps): Observable<articlesProps> {
    return this.articleHttpService.createArticle(article);
  }

  // Atualizar artigo
  updateArticle(id: string, article: articlesProps): Observable<articlesProps> {
    return this.articleHttpService.updateArticle(id, article);
  }

  // Excluir artigo
  deleteArticle(id: string): Observable<articlesProps> {
    return this.articleHttpService.deleteArticle(id);
  }

  private articles: articlesProps[] = [...articlesDataBase];

  getArticles(): articlesProps[] {
    return this.articles;
  }

  getArticleByIndex(index: string): articlesProps | undefined {
    return this.articles.find(a => a.id === index);
  }

  getArticlesList(): Observable<any> {
    return this.articleHttpService.getArticlesList();
  }

  getRecentArticles(limit: number): articlesProps[] {
    const recentArticles = this.articles
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    return recentArticles;
  }

  getRecentCategories(limit: number): string[] {
    const recentArticles = this.getRecentArticles(limit);
    const categories = new Set(recentArticles.map((article: articlesProps) => article.category));
    return Array.from(categories);
  }

  addArticle(article: articlesProps): void {
    this.articles.push(article);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('articles', JSON.stringify(this.articles));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('articles');
    if (saved) {
      this.articles = JSON.parse(saved);
    }
  }

  incrementArticleById(id: string): articlesProps | undefined {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      this.incrementViews(article.id);
    }
    return article;
  }

  incrementViews(id: string): void {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      article.views = (article.views ?? 0) + 1;
    }
  }

  getMostViewed(limit: number = 3): articlesProps[] {
    return [...this.articles]
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, limit);
  }

  getArticlesHomepage(): Observable<any> {
    return this.articleHttpService.getArticlesHomepage();
  }

  createClientArticle(article: ClientArticleRequest): Observable<ClientArticle> {
    return this.articleHttpService.createClientArticle(article);
  }

  getAllClientArticles(userId: string): Observable<ClientArticleListResponse> {
    return this.articleHttpService.getAllClientArticles(userId);
  }

  getClientArticleById(id: string): Observable<ClientArticle> {
    return this.articleHttpService.getClientArticleById(id);
  }

  updateClientArticle(id: string, article: Partial<ClientArticleRequest>): Observable<ClientArticle> {
    return this.articleHttpService.updateClientArticle(id, article);
  }

  deleteClientArticle(id: string): Observable<any> {
    return this.articleHttpService.deleteClientArticle(id);
  }

  deleteManyClientArticles(ids: string[]): Observable<any> {
    return this.articleHttpService.deleteManyClientArticles(ids);
  }
}
