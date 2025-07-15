import { Routes } from "@angular/router";


export const routesConteudo: Routes =[
    {
          path: 'artigos/:id',
          title: 'Artigos',
          loadComponent: () => import('./artigos-page/article-page.component').then(m => m.ArticlePageComponent)
      },
    {
        path: 'destaques',
        title: 'Destaques',
        loadComponent: () => import('./destaques-page/destaques-page.component').then(m => m.DestaquesPageComponent)
    },
    {
        path: 'eventos',
        title: 'Eventos',
        loadComponent: () => import('./eventos-page/eventos-page.component').then(m => m.EventosPageComponent)
    },
    {
        path: 'newsletter',
        title: 'News Letters',
        loadComponent: () => import('./newsletter/newsletter.component').then(m => m.NewsletterComponent)
    },
]
