import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { articlesProps } from '../../../types/articles';
import { ArticleService } from '../../../service/article.service';

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [CommonModule],
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
    if (!isNaN(index)) {
      this.article = articles[index];
    }
  }
}
