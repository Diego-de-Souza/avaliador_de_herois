import { Routes } from "@angular/router";

export const routesArticles: Routes = [
  {
    path: 'article-page/:id',
    title: 'Visualizar Artigo',
    loadComponent: () => import('./article-page-component/article-page.component').then(m => m.ArticlePageComponent),
  },
  {
    path: 'form-article/:id',
    title: 'Editar Artigo',
    loadComponent: () => import('./form-article/form-article.component').then(m => m.FormArticleComponent),
  },
  {
    path: 'form-article',
    title: 'Criar Artigo',
    loadComponent: () => import('./form-article/form-article.component').then(m => m.FormArticleComponent),
  },
];
