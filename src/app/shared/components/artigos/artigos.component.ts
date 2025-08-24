// ...existing code...
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-artigos',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule, FontAwesomeModule],
  templateUrl: './artigos.component.html',
  styleUrl: './artigos.component.css'
})
export class ArtigosComponent implements OnInit {
  private articleService: ArticleService = inject(ArticleService);
  private themeService: ThemeService = inject(ThemeService);

  public articles: articlesProps[] = [];

  getAllArticles(): articlesProps[] {
    return this.articles;
  }
  public _themeArtigos: string | null = 'dark';
  public categoryPageMap: { [key: string]: number } = {}; 
  public articlesPerPage = 3; 

  ngOnInit() {
    this.articleService.loadFromLocalStorage();
    this.articles = this.articleService.getArticles();
    this.initCategoryPages();
    this.themeService.theme$.subscribe(theme =>{
      this._themeArtigos = theme;
    })
  }

  readonly ARTICLES_PER_PAGE = 3;

  initCategoryPages() {
    this.getCategories().forEach(category => {
      this.categoryPageMap[category] = 0;
    });
  }

  getCategories(): string[] {
    const categories = new Set(this.articles.map(article => article.category));
    return Array.from(categories);
  }

  filteredArticles(category: string): articlesProps[] {
    const all = this.articles.filter(article => article.category === category);
    const page = this.categoryPageMap[category] || 0;
    const start = page * this.ARTICLES_PER_PAGE;
    return all.slice(start, start + this.ARTICLES_PER_PAGE);
  }


  getTotalPages(category: string): number {
    const total = this.articles.filter(article => article.category === category).length;
    return Math.ceil(total / this.ARTICLES_PER_PAGE);
  }

  changePage(category: string, direction: 'next' | 'prev') {
    const currentPage = this.categoryPageMap[category] || 0;
    const totalPages = this.getTotalPages(category);

    if (direction === 'next' && currentPage < totalPages - 1) {
      this.categoryPageMap[category] = currentPage + 1;
    }

    if (direction === 'prev' && currentPage > 0) {
      this.categoryPageMap[category] = currentPage - 1;
    }
  }

  nextPage(category: string) {
    const totalArticles = this.articles.filter(a => a.category === category).length;
    const maxPage = Math.floor((totalArticles - 1) / this.articlesPerPage);
    if (this.categoryPageMap[category] < maxPage) {
      this.categoryPageMap[category]++;
    }
  }

  prevPage(category: string) {
    if (this.categoryPageMap[category] > 0) {
      this.categoryPageMap[category]--;
    }
  }

  getRecentArticles(limit: number): articlesProps[] {
    const recentArticles = this.articles
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    return recentArticles;
  }

}
