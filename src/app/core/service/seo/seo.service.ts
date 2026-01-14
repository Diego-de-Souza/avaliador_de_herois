import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly router = inject(Router);

  private readonly defaultImage = 'https://seusite.com/assets/og-image-default.jpg';
  private readonly siteUrl = 'https://seusite.com';

  constructor() {
    // Atualizar URL quando rota mudar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Pode adicionar lógica adicional aqui se necessário
      });
  }

  updateMetaTags(config: SeoConfig): void {
    const url = config.url || this.router.url;
    const fullUrl = `${this.siteUrl}${url}`;
    const image = config.image || this.defaultImage;
    const type = config.type || 'website';

    // Title
    const fullTitle = config.title.includes('Heroes Platform') 
      ? config.title 
      : `${config.title} | Heroes Platform`;
    this.title.setTitle(fullTitle);

    // Basic Meta Tags
    this.updateOrCreateTag('name', 'description', config.description);
    if (config.keywords) {
      this.updateOrCreateTag('name', 'keywords', config.keywords);
    }
    this.updateOrCreateTag('name', 'author', config.author || 'Heroes Platform');

    // Open Graph Tags
    this.updateOrCreateTag('property', 'og:title', config.title);
    this.updateOrCreateTag('property', 'og:description', config.description);
    this.updateOrCreateTag('property', 'og:image', image);
    this.updateOrCreateTag('property', 'og:url', fullUrl);
    this.updateOrCreateTag('property', 'og:type', type);
    this.updateOrCreateTag('property', 'og:site_name', 'Heroes Platform');
    this.updateOrCreateTag('property', 'og:locale', 'pt_BR');

    // Article specific tags
    if (type === 'article') {
      if (config.author) {
        this.updateOrCreateTag('property', 'article:author', config.author);
      }
      if (config.publishedTime) {
        this.updateOrCreateTag('property', 'article:published_time', config.publishedTime);
      }
      if (config.modifiedTime) {
        this.updateOrCreateTag('property', 'article:modified_time', config.modifiedTime);
      }
    }

    // Twitter Card Tags
    this.updateOrCreateTag('name', 'twitter:card', 'summary_large_image');
    this.updateOrCreateTag('name', 'twitter:title', config.title);
    this.updateOrCreateTag('name', 'twitter:description', config.description);
    this.updateOrCreateTag('name', 'twitter:image', image);
    this.updateOrCreateTag('name', 'twitter:site', '@heroesplatform');

    // Canonical URL
    this.updateOrCreateTag('rel', 'canonical', fullUrl);
  }

  private updateOrCreateTag(attr: 'name' | 'property' | 'rel', selector: string, content: string): void {
    if (attr === 'rel') {
      // Para canonical, usar link tag
      let link = document.querySelector(`link[rel="${selector}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', selector);
        document.head.appendChild(link);
      }
      link.setAttribute('href', content);
    } else {
      const existingTag = this.meta.getTag(`${attr}="${selector}"`);
      if (existingTag) {
        this.meta.updateTag({ [attr]: selector, content });
      } else {
        this.meta.addTag({ [attr]: selector, content });
      }
    }
  }

  // Método para artigos
  updateArticleTags(article: {
    title: string;
    description: string;
    image?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    keywords?: string;
  }): void {
    this.updateMetaTags({
      title: article.title,
      description: article.description,
      keywords: article.keywords,
      image: article.image,
      type: 'article',
      author: article.author,
      publishedTime: article.publishedTime,
      modifiedTime: article.modifiedTime
    });
  }

  // Método para páginas de heróis
  updateHeroTags(hero: {
    name: string;
    description: string;
    image?: string;
    studio?: string;
  }): void {
    this.updateMetaTags({
      title: `${hero.name} - Perfil Completo`,
      description: hero.description,
      keywords: `${hero.name}, ${hero.studio}, heróis, super-heróis`,
      image: hero.image,
      type: 'profile'
    });
  }

  // Método para quizzes
  updateQuizTags(quiz: {
    name: string;
    description: string;
    theme: string;
    image?: string;
  }): void {
    this.updateMetaTags({
      title: `Quiz: ${quiz.name}`,
      description: quiz.description,
      keywords: `quiz, ${quiz.theme}, heróis, teste seus conhecimentos`,
      image: quiz.image,
      type: 'website'
    });
  }
}
