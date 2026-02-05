import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MarkdownModule } from 'ngx-markdown';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { ArticleCommentsComponent } from '../../../shared/components/article-comments/article-comments.component';
import { HttpClient } from '@angular/common/http';
import { ImageDefaultInterface } from '../../../core/interface/image-default.interface';
import { Images } from '../../../data/image-default';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MarkdownModule,
    ArticleCommentsComponent
  ],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articleService = inject(ArticleService);
  private readonly http = inject(HttpClient);

  public themeHome: string | null = 'dark';
  public article: articlesProps | null = null;
  public loading = true;
  public markdownContent = '';
  public error = false;
  public imageDefault: ImageDefaultInterface = Images[0];

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.themeHome = theme;
    });

    this.route.paramMap.subscribe(params => {
      const articleId = params.get('id');
      if (articleId) {
        this.loadArticle(articleId);
      }
    });
  }

  loadArticle(id: string): void {
    this.loading = true;
    this.error = false;

    this.articleService.getArticlesList().subscribe({
      next: (response) => {
        const article = response.data.find((a: articlesProps) => String(a.id) === id);
        if (article) {
          // Processa o artigo para usar imageDefault quando route for null
          this.article = this.processArticle(article);
          this.loadMarkdownContent(this.article);
          this.articleService.incrementViews(String(article.id));
          this.loading = false;
        } else {
          this.error = true;
          this.loading = false;
        }
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  // Processa artigo e define imageDefault quando route for null
  processArticle(article: articlesProps): articlesProps {
    // Se route for null, usa imageDefault
    if (article.route === null || article.route === undefined) {
      return {
        ...article,
        image: article.image || this.imageDefault.image
      };
    }
    return article;
  }

  loadMarkdownContent(article: articlesProps): void {
    if (article.text && article.text.startsWith('/markdown/')) {
      const markdownPath = article.text;
      this.http.get(markdownPath, { responseType: 'text' }).subscribe({
        next: (content) => {
          this.markdownContent = content;
        },
        error: () => {
          this.markdownContent = article.text || '';
        }
      });
    } else {
      this.markdownContent = article.text || '';
    }
  }

  goBack(): void {
    this.router.navigate(['/webmain/artigos']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
}
