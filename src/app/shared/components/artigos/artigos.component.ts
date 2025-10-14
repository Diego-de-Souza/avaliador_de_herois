import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-artigos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './artigos.component.html',
  styleUrl: './artigos.component.css'
})
export class ArtigosComponent implements OnInit {
  public themeArtigos: string = 'dark';
  public articles: articlesProps[] = [];
  public articlesPerPage = 3; // Quantos artigos por categoria
  mostViewed: articlesProps[] = [];
  getRecentArticles: articlesProps[] = [];

  @ViewChild('artigosContainer', { static: true }) artigosContainer!: ElementRef;

  constructor(
    private articleService: ArticleService,
    private renderer: Renderer2,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.articleService.loadFromLocalStorage();
    this.articles = this.articleService.getArticles();
    this.mostViewed = this.articleService.getMostViewed(3);
    this.getRecentArticles = this.articleService.getRecentArticles(3);
    this.themeService.theme$.subscribe(theme => {
      this.themeArtigos = theme;
      this.applyTheme(theme);
    });
  }

  applyTheme(theme: string) {
    const el = document.getElementById('theme_artigos');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }

  // retorna todas as categorias sem repetição
  getCategories(): string[] {
    const categories = new Set(this.articles.map(article => article.category));
    return Array.from(categories);
  }

  // retorna as 3 categorias com últimos artigos recentes **
  filteredCategory(): string[] {
    const categories = this.getCategories();
    const recentArticles = this.getRecentArticles;
    return categories.filter(category => recentArticles.some(article => article.category === category));
  }

  // filtra os artigos pela categoria
  filteredArticles(category: string): articlesProps[] {
    return this.articles
    .filter(article => article.category === category)
    .slice(0, this.articlesPerPage);
  }
}
