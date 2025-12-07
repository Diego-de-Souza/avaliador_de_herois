import { Routes } from "@angular/router";


export const routesConteudo: Routes =[
    {
        path: 'artigos',
        title: 'Artigos',
        loadComponent: () => import('./artigos-page/artigos-page.component').then(m => m.ArtigosPageComponent)
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
