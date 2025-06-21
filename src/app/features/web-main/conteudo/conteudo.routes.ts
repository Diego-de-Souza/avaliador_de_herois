import { Routes } from "@angular/router";


export const routesConteudo: Routes =[
    {
        path: 'artigos',
        title: 'Artigos',
        loadComponent: () => import('./artigos/artigos.component').then(m => m.ArtigosComponent)
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