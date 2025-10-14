import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NewsletterComponent } from '../../../shared/components/newsletter/newsletter.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { Copywriter } from '../../../core/interface/copywriter.interface';
import { CopywriterUser } from '../../../core/storage/copywriters/copywriters.data';
import { MarkdownModule } from 'ngx-markdown';
import { NovidadesComponent } from '../../../shared/components/novidades/novidades.component';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NewsletterComponent,
    FooterComponent,
    MarkdownModule,
    NovidadesComponent
  ],
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.css']
})
export class ArticlePageComponent implements OnInit {
  public themeHome: string | null = 'dark';
  article: articlesProps | null = null;
  articleId!: number;
  public copywriter: Copywriter = CopywriterUser;
  articleContent: string = "";

  // DEV MODE
  // public imgDevMode: string = CopywriterUser[0].foto;
  // DEV MODE

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private http: HttpClient // DEV MODE
  ) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme =>{
      this.themeHome = theme;
      this.applyTheme(theme);
    });
    this.articleService.loadFromLocalStorage();


    // const id = this.route.snapshot.paramMap.get('id');
    // const index = Number(id);

    this.route.paramMap.subscribe(params => {
      this.articleId = Number(params.get('id'));
      this.carregarArtigo(this.articleId);
    });

    if (this.article?.text) {
      this.loadMarkdown(this.article.text);
    }
  }

  carregarArtigo(id: number) {
    const articles = this.articleService.getArticles();
    if (articles.length > 0) {
      this.article = articles.find(article => article.id === id) || null;
    }
  }

  // DEV MODE
  loadMarkdown(path: string) {
    this.http.get(path, { responseType: 'text' })
      .subscribe(data => {
        this.articleContent = data; // 👈 texto markdown
      });
  }
  // DEV MODE

  summaryAsMarkdown(): string {
    if (!this.article || !this.article.summary) {
      return '';
    }
    return this.article.summary
      .map(item => `${item.level === 2 ? '-- ' : '- '}${item.text}`)
      .join('\n');
  }

  subCount(startIndex: number): number {
    let count = 0;
    if (!this.article || !this.article.summary) {
      return count;
    }
    this.summaryAsMarkdown()
    for (let i = startIndex + 1; i < this.article.summary.length; i++) {
      if (this.article.summary[i].level === 2) count++;
      else break;
    }
    return count;
  }

  applyTheme(theme: string) {
    const el = document.getElementById('container-articles-page');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
