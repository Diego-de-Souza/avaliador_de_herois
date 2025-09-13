import { Component, OnInit } from '@angular/core';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../../core/service/articles/articles.service';

@Component({
  selector: 'app-view-artigos',
  standalone: true,
  imports: [HeaderPlatformComponent, CommonModule],
  templateUrl: './view-artigos.component.html',
  styleUrl: './view-artigos.component.css'
})
export class ViewArtigosComponent implements OnInit {
  public isList: boolean = false;
  public articles: any[] = [];

  constructor(
    private articlesService: ArticleService
  ) { }

  ngOnInit(): void {
    this.articlesService.getArticlesList().subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.articles = response.articles;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar artigos:', error);
      }
    })
  }

  editArtigos(article_id: number) {

  }

  deleteArtigos(article_id: number) {

  }

}
