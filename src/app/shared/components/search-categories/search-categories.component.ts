import { Component, OnInit } from '@angular/core';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-categories.component.html',
  styleUrl: './search-categories.component.css'
})
export class SearchCategoriesComponent implements OnInit {
  public articles: articlesProps[] = [];

  constructor(
    private articleService: ArticleService,
  ) {}

  ngOnInit() {
    this.articles = this.articleService.getArticles();
  }

  // retorna todas as categorias sem repetição
  getCategories(): string[] {
    const categories = new Set(this.articles.map(article => article.category));
    return Array.from(categories);
  }
}
