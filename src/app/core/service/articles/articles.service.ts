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
  
  private articles: articlesProps[] = [...articlesDataBase];

  getArticles(): articlesProps[] {
    return this.articles;
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

  getArticleByIndex(index: number): articlesProps | undefined {
    return this.articles[index];
  }

  updateArticle(index: number, updatedArticle: articlesProps): void {
    this.articles[index] = updatedArticle;
    this.saveToLocalStorage();
  }

  getArticlesList(): Observable<any>{
    return this.http.get(`${environment.apiURL}/articles/find-all-articles`);
  }
}
