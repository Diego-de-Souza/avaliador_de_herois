import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MarkdownModule } from 'ngx-markdown';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { NewsletterComponent } from '../../../shared/components/newsletter/newsletter.component';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';
import { AdvancedSearchComponent } from '../../../shared/components/advanced-search/advanced-search.component';
import { SearchService, SearchFilters } from '../../../core/service/search/search.service';

interface CarouselImage {
  url: string;
  title: string;
  description: string;
  route: string;
}

interface imagesProps {
  url: string;
  title: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MarkdownModule, 
    NewsletterComponent,
    CarouselComponent,
    AdvancedSearchComponent
  ],
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.css']
})
export class ArticlePageComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articleService = inject(ArticleService);
  private readonly searchService = inject(SearchService);

  public themeHome: string | null = 'dark';

  images: imagesProps[] = [];
  getRecentArticles: articlesProps[] = [];

  articles: articlesProps[] = [];
  filteredArticles: articlesProps[] = [];
  categories: string[] = [];
  themes: string[] = [];
  filter: string = '';
  dateFilter: string = '';
  categoryFilter: string = '';
  keywordFilter: string = '';
  themeFilter: string = '';
  authorFilter: string = '';
  page: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.themeHome = theme;
    });

    this.articleService.getArticlesList().subscribe((response) => {
      this.articles = response.data;
      this.categories = [...new Set(this.articles.map(a => a.category).filter(Boolean))];
      this.themes = [
        'Marvel',
        'DC',
        'Anime',
        'Destaque'
      ];
      this.getRecentArticles = this.articleService.getRecentArticles(5);
      this.images = this.getImages();
      this.applyFilter();
    });
  }

  getImages(): imagesProps[] {
    const recentArticles = this.getRecentArticles;
    if (recentArticles.length === 0) return [];
    return recentArticles.map(article => ({
      url: article.thumbnail,
      title: article.title,
      description: article.description,
      route: article.route
    }));
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement)?.value || '';
  }

  setDateFilter(date: string) {
    this.dateFilter = date;
    this.applyFilter();
  }
  setCategoryFilter(category: string) {
    this.categoryFilter = category;
    this.applyFilter();
  }
  setKeywordFilter(keyword: string) {
    this.keywordFilter = keyword;
    this.applyFilter();
  }
  setThemeFilter(theme: string) {
    this.themeFilter = theme;
    this.applyFilter();
  }
  setAuthorFilter(author: string) {
    this.authorFilter = author;
    this.applyFilter();
  }
  setFilter(filter: string) {
    this.filter = filter;
    this.applyFilter();
  }

  applyFilter() {
    let result = [...this.articles];

    if (this.dateFilter) {
      result = result.filter(a => a.created_at?.startsWith(this.dateFilter));
    }
    if (this.categoryFilter) {
      result = result.filter(a => a.category === this.categoryFilter);
    }
    if (this.keywordFilter) {
      result = result.filter(a => a.keyWords?.some(k => k.toLowerCase().includes(this.keywordFilter.toLowerCase())));
    }
    if (this.themeFilter) {
      result = result.filter(a => a.theme === this.themeFilter);
    }
    if (this.authorFilter) {
      result = result.filter(a => a.author?.toLowerCase().includes(this.authorFilter.toLowerCase()));
    }
    if (this.filter === 'destaques') {
      result = result.filter(a => a.theme === 'Destaque');
    }
    if (this.filter === 'mais-vistos') {
      result = [...result].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    this.filteredArticles = result;
    this.totalPages = Math.max(1, Math.ceil(this.filteredArticles.length / this.pageSize));
    this.page = Math.min(this.page, this.totalPages);
  }

  paginatedArticles() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredArticles.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  readonly defaultArticleImage = '/img/home/destaques/features_articles.png';

  getArticleImage(article: articlesProps): string {
    const img = article.image ?? article.thumbnail ?? '';
    const hasNoImage = !img || (typeof img === 'string' && img.trim() === '');
    return hasNoImage ? this.defaultArticleImage : img;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('features_articles.png')) {
      img.src = this.defaultArticleImage;
    }
  }

  openArticle(article: articlesProps) {
    // Redirecionar para página de detalhes
    this.router.navigate(['/webmain/artigos', article.id]);
  }

  onSearchPerformed(filters: SearchFilters) {
    // Aplicar filtros da busca avançada
    if (filters.query) {
      this.keywordFilter = filters.query;
    }
    if (filters.category) {
      this.categoryFilter = filters.category;
    }
    if (filters.author) {
      this.authorFilter = filters.author;
    }
    if (filters.tags && filters.tags.length > 0) {
      // Se houver tags, pode adicionar lógica específica
    }
    if (filters.dateFrom) {
      this.dateFilter = filters.dateFrom;
    }
    if (filters.sortBy) {
      // Aplicar ordenação se necessário
    }
    
    this.applyFilter();
  }
}