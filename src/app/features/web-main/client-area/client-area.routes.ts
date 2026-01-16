import { Routes } from "@angular/router";
import { plansGuard } from "../../../guard/plans.guard";

export const clientAreaRoutes: Routes = [
  {
    path: '',
    title: 'Área do Cliente',
    loadComponent: () => import('./client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent),
    canActivate: [plansGuard]
  },
  {
    path: 'articles',
    title: 'Meus Artigos',
    loadComponent: () => import('./articles/client-article-list/client-article-list.component').then(m => m.ClientArticleListComponent),
    canActivate: [plansGuard]
  },
  {
    path: 'articles/create',
    title: 'Criar Artigo',
    loadComponent: () => import('./articles/client-article-form/client-article-form.component').then(m => m.ClientArticleFormComponent),
    canActivate: [plansGuard]
  },
  {
    path: 'articles/edit/:id',
    title: 'Editar Artigo',
    loadComponent: () => import('./articles/client-article-form/client-article-form.component').then(m => m.ClientArticleFormComponent),
    canActivate: [plansGuard]
  },
  {
    path: 'news',
    title: 'Minhas Notícias',
    loadComponent: () => import('./news/client-news-list/client-news-list.component').then(m => m.ClientNewsListComponent),
    canActivate: [plansGuard]
  },
  {
    path: 'news/create',
    title: 'Criar Notícia',
    loadComponent: () => import('./news/client-news-form/client-news-form.component').then(m => m.ClientNewsFormComponent),
    canActivate: [plansGuard]
  },
  {
    path: 'news/edit/:id',
    title: 'Editar Notícia',
    loadComponent: () => import('./news/client-news-form/client-news-form.component').then(m => m.ClientNewsFormComponent),
    canActivate: [plansGuard]
  }
];
