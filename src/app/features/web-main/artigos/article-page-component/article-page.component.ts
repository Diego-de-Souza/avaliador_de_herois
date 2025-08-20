import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { articlesProps } from '../../../../core/interface/articles.interface';
import { ArticleService } from '../../../../core/service/articles/articles.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { NewsletterComponent } from '../../../../shared/components/newsletter/newsletter.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NewsletterComponent,
    FooterComponent
  ],
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.css']
})
export class ArticlePageComponent implements OnInit {
  article: articlesProps | null = null;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const articles = this.articleService.getArticles();

    const index = Number(id);
    if (index) {
    this.article = articles.find(article => article.id === index) || null;
  }
  }
}
