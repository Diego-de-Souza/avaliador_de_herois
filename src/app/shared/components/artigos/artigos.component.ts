import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { NovidadesComponent } from '../novidades/novidades.component';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-artigos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    NovidadesComponent],
  templateUrl: './artigos.component.html',
  styleUrl: './artigos.component.css'
})
export class ArtigosComponent implements OnInit {
  public themeArtigos: string = 'dark';
  public articles: articlesProps[] = [];
  public categoryPageMap: { [key: string]: number } = {}; // Página atual de cada categoria
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
    this.initCategoryPages(); // Inicializa a paginação
    this.themeService.theme$.subscribe(theme => {
      this.themeArtigos = theme;
      this.applyTheme(theme);
    });
  }

  private applyTheme(theme: string): void {
    const el = this.artigosContainer.nativeElement;
    if (!el) return;

    if (theme === 'dark') {
      this.renderer.removeClass(el, 'light');
      this.renderer.addClass(el, 'dark');
    } else {
      this.renderer.removeClass(el, 'dark');
      this.renderer.addClass(el, 'light');
    }
  }

  initCategoryPages() {
    this.getCategories().forEach(category => {
      this.categoryPageMap[category] = 0;
    });
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
    const all = this.articles.filter(article => article.category === category);
    const page = this.categoryPageMap[category] || 0;
    const start = page * this.articlesPerPage;
    return all.slice(start, start + this.articlesPerPage);
  }

  getTotalPages(category: string): number {
    const total = this.articles.filter(article => article.category === category).length;
    return Math.ceil(total / this.articlesPerPage);
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

}
