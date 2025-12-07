import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../../core/service/articles/articles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-artigos',
  standalone: true,
  imports: [HeaderPlatformComponent, CommonModule],
  templateUrl: './view-artigos.component.html',
  styleUrl: './view-artigos.component.css'
})
export class ViewArtigosComponent implements OnInit {
  private readonly router = inject(Router);
  public isList: boolean = false;
  public articles = signal<any[]>([]);

  constructor(
    private articlesService: ArticleService
  ) { }

  ngOnInit(): void {
    this.articlesService.getArticlesList().subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.articles.set(response.data);
          if(this.articles().length > 0){
            this.isList = true;
          }
        }
      },
      error: (error) => {
        console.error('Erro ao carregar artigos:', error);
      }
    })
  }

  editArtigos(article_id: number) {
    this.router.navigate([`/plataforma/cadastro/artigos/${article_id}`]);
  }

  deleteArtigos(article_id: number) {
    this.articlesService.deleteArticle(article_id).subscribe({
      next: (response) => {
        console.log('Artigo excluído com sucesso:', response);  
        this.articles.set(this.articles().filter(article => article.id !== article_id));
      },
      error: (error) => {
        console.error('Erro ao excluir o artigo:', error);
      }
    });
  }

}
