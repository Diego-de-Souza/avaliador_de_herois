import { Component, OnInit } from '@angular/core';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../../core/service/articles/articles.service';
import { articlesProps } from '../../../../core/interface/articles.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-artigos',
  standalone: true,
  imports: [HeaderPlatformComponent, CommonModule],
  templateUrl: './view-artigos.component.html',
  styleUrl: './view-artigos.component.css'
})
export class ViewArtigosComponent implements OnInit {
  public isList: boolean = true;
  public articles: articlesProps[] = [];

  constructor(
    private articlesService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // DEV MODE
    this.articles = this.articlesService.getArticles();
    console.log('Artigos carregados:', this.articles);
    // this.articlesService.getArticlesList().subscribe({
    //   next: (response) => {
    //     if (response && response.length > 0) {
    //       this.articles = response.articles;
    //       console.log('Artigos carregados com sucesso:', response);
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar artigos:', error);
    //   }
    // })
  }

  editArtigos(article_id: number) {
    this.router.navigate([`/plataforma/cadastro/artigos/studio/${article_id}`]);
  }

  deleteArtigos(article_id: number) {

  }

}
