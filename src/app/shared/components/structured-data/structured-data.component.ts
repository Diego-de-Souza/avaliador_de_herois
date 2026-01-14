import { Component, input, AfterViewInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface StructuredDataConfig {
  type: 'Article' | 'WebSite' | 'Organization' | 'BreadcrumbList' | 'Person';
  data: any;
}

@Component({
  selector: 'app-structured-data',
  standalone: true,
  template: `
    <script type="application/ld+json" [innerHTML]="safeJson()"></script>
  `
})
export class StructuredDataComponent implements AfterViewInit {
  private readonly sanitizer = inject(DomSanitizer);
  
  config = input<StructuredDataConfig>();

  safeJson(): SafeHtml {
    if (!this.config()) {
      return this.sanitizer.bypassSecurityTrustHtml('{}');
    }

    const json = JSON.stringify(this.config()!.data, null, 2);
    return this.sanitizer.bypassSecurityTrustHtml(json);
  }

  ngAfterViewInit() {
    // Component está pronto
  }

  /**
   * Criar structured data para artigo
   */
  static createArticleData(article: {
    title: string;
    description: string;
    image?: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    url: string;
  }): StructuredDataConfig {
    return {
      type: 'Article',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: article.image || 'https://seusite.com/og-image.jpg',
        author: {
          '@type': 'Person',
          name: article.author
        },
        publisher: {
          '@type': 'Organization',
          name: 'Heroes Platform',
          logo: {
            '@type': 'ImageObject',
            url: 'https://seusite.com/logo.png'
          }
        },
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime || article.publishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': article.url
        }
      }
    };
  }

  /**
   * Criar structured data para site
   */
  static createWebsiteData(siteUrl: string, searchUrl?: string): StructuredDataConfig {
    const data: any = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Heroes Platform',
      url: siteUrl,
      description: 'A maior plataforma brasileira sobre heróis, cultura geek, jogos interativos e quizzes.',
      publisher: {
        '@type': 'Organization',
        name: 'Heroes Platform'
      }
    };

    if (searchUrl) {
      data.potentialAction = {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}${searchUrl}?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      };
    }

    return {
      type: 'WebSite',
      data
    };
  }

  /**
   * Criar structured data para organização
   */
  static createOrganizationData(): StructuredDataConfig {
    return {
      type: 'Organization',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Heroes Platform',
        url: 'https://seusite.com',
        logo: 'https://seusite.com/logo.png',
        description: 'A maior plataforma brasileira sobre heróis, cultura geek, jogos interativos e quizzes.',
        sameAs: [
          'https://www.instagram.com/heroesplatform',
          'https://www.facebook.com/heroesplatform',
          'https://twitter.com/heroesplatform'
        ]
      }
    };
  }

  /**
   * Criar breadcrumb list
   */
  static createBreadcrumbData(items: Array<{ name: string; url: string }>): StructuredDataConfig {
    return {
      type: 'BreadcrumbList',
      data: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      }
    };
  }
}
