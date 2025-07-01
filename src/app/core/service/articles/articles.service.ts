import { Injectable } from '@angular/core';
import { articlesProps } from '../../interface/articles.interface';
import { articlesDataBase } from '../../../data/articles';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
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
}
