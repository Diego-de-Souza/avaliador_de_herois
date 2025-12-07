import { inject, Injectable } from '@angular/core';
import { articlesProps } from '../../interface/articles.interface';
import { articlesDataBase } from '../../../data/articles';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly http = inject(HttpClient);

  // // Buscar todos artigos
  // getArticles(): Observable<Article[]> {
  //   return this.http.get<Article[]>(this.apiUrl);
  // }

  // Buscar artigo por ID
  getArticleById(id: number): Observable<String[]> {
    return this.http.get<String[]>(`${environment.apiURL}/articles/find-one-article/${id}`);
  }

  // Criar artigo
  createArticle(article: articlesProps): Observable<articlesProps> {
    return this.http.post<articlesProps>(`${environment.apiURL}/articles`, article);
  }

  // Atualizar artigo
  updateArticle(id: number, article: articlesProps): Observable<articlesProps> {
    return this.http.put<articlesProps>(`${environment.apiURL}/articles/update/${id}`, article);
  }

  // Excluir artigo
  deleteArticle(id: number): Observable<any> {
    return this.http.delete(`${environment.apiURL}/articles/delete-one-article/${id}`);
  }

  // // Incrementar visualizações
  // incrementViews(id: number): Observable<any> {
  //   return this.http.put(`${environment.apiURL}/${id}/views`, {});
  // }

  // // Buscar os mais vistos
  // getMostViewed(limit: number = 3): Observable<Article[]> {
  //   return this.http.get<Article[]>(`http://localhost:3000/articles-most-viewed/${limit}`);
  // }

  private articles: articlesProps[] = [...articlesDataBase];

  getArticles(): articlesProps[] {
    return this.articles;
  }

  getArticleByIndex(index: number): articlesProps | undefined {
    return this.articles.find(a => a.id === index);
  }

  getArticlesList(): Observable<any> {
    return this.http.get(`${environment.apiURL}/articles/find-all-articles`);
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

  incrementArticleById(id: number): articlesProps | undefined {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      this.incrementViews(article.id);
    }
    return article;
  }

  incrementViews(id: number): void {
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
    return this.http.get<any>(`${environment.apiURL}/articles/articles-for-homepage`);
  }
}
