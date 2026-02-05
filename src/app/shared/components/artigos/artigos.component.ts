import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { Images } from '../../../data/image-default';
import { ImageDefaultInterface } from '../../../core/interface/image-default.interface';

const DEFAULT_ARTICLE_IMAGE = '/img/home/destaques/features_articles.png';

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
  private readonly articleService = inject(ArticleService);
  private readonly themeService = inject(ThemeService);
  private readonly renderer = inject(Renderer2);

  public themeArtigos: string = 'dark';
  public articles: articlesProps[] = [];
  public articlesPerPage = 3;
  public imageDefault: ImageDefaultInterface = Images[0];
  mostViewed: articlesProps[] = [];
  getRecentArticles: articlesProps[] = [];

  artigosPreview = [
    {
      id: 1,
      title: 'O Universo Marvel: Heróis e Vilões',
      summary: 'Descubra curiosidades e histórias dos principais personagens da Marvel.',
      image: 'assets/img/artigos/marvel.jpg',
      theme: 'Marvel',
      themeColor: '#00D2FF'
    },
    {
      id: 2,
      title: 'DC Comics: Lendas e Origens',
      summary: 'Explore o legado dos heróis da DC e suas sagas mais marcantes.',
      image: 'assets/img/artigos/dc.jpg',
      theme: 'DC',
      themeColor: '#FFD700'
    },
    {
      id: 3,
      title: 'Anime Heroes: Cultura Geek em Alta',
      summary: 'Saiba como os animes influenciaram o universo dos super-heróis.',
      image: 'assets/img/artigos/anime.jpg',
      theme: 'Anime',
      themeColor: '#F252AA'
    }
  ];
  @ViewChild('artigosContainer', { static: true }) artigosContainer!: ElementRef;

  ngOnInit() {
    this.articleService.getArticlesHomepage().subscribe((resp) => {
      this.mostViewed = this.processArticles(resp.data.featuredArticles);
      this.getRecentArticles = this.processArticles(resp.data.latestArticles);
      this.articles = this.processArticles(resp.data.categories);
    });
    this.themeService.theme$.subscribe(theme => {
      this.themeArtigos = theme;
      this.applyTheme(theme);
    });
  }

  // Processa artigos e usa features_articles.png quando image/thumbnail estiver vazio
  processArticles(articles: articlesProps[]): articlesProps[] {
    if (!articles || !Array.isArray(articles)) {
      return [];
    }
    
    return articles.map(article => {
      const img = article.image ?? article.thumbnail ?? '';
      const hasNoImage = !img || (typeof img === 'string' && img.trim() === '');
      return {
        ...article,
        image: hasNoImage ? DEFAULT_ARTICLE_IMAGE : img
      };
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('features_articles.png')) {
      img.src = DEFAULT_ARTICLE_IMAGE;
    }
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

  // Mapeia os artigos para garantir as propriedades esperadas pelo template
  mapArticles(articles: articlesProps[]): articlesProps[] {
    return articles.map(article => ({
      ...article,
      image: article.thumbnail, // Usa thumbnail como imagem principal
      theme: this.getThemeName(article.category),
      themeColor: this.getThemeColor(article.category)
    }));
  }

  // Retorna o nome do tema baseado na categoria
  getThemeName(category: string): string {
    switch (category.toLowerCase()) {
      case 'marvel': return 'Marvel';
      case 'dc': return 'DC';
      case 'anime': return 'Anime';
      default: return category;
    }
  }

  // Retorna a cor do tema baseado na categoria
  getThemeColor(category: string): string {
    switch (category.toLowerCase()) {
      case 'marvel': return '#00D2FF';
      case 'dc': return '#FFD700';
      case 'anime': return '#F252AA';
      default: return '#00D2FF';
    }
  }

  filteredArticles(category: string): articlesProps[] {
    return this.articles
      .filter(article => article.category === category)
      .slice(0, this.articlesPerPage);
  }
}