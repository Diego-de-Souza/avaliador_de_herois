import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-novidades',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule],
  templateUrl: './novidades.component.html',
  styleUrl: './novidades.component.css'
})
export class NovidadesComponent implements OnInit {
  public articles: articlesProps[] = [];

  constructor(
    private articleService: ArticleService
  ) { }

  ngOnInit() {
    this.articleService.loadFromLocalStorage();
    this.articles = this.articleService.getArticles();
  }

  getRecentArticles(limit: number): articlesProps[] {
    const recentArticles = this.articles
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    return recentArticles;
  }
}
