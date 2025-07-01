import { Routes } from "@angular/router";


export const routesViews: Routes = [
    {
        path: 'view-artigos',
        title: 'Lista de Artigos',
        loadChildren: () => import('./view-artigos/view-articles.routes').then(m => m.routesArticles)
    },
    {
        path: 'view-curiosidades',
        title: 'Lista de Curiosidades',
        loadComponent: () => import('./view-curiosidades/view-curiosidades.component').then(m => m.ViewCuriosidadesComponent)
    },
    {
        path: 'view-heroes',
        title: 'Lista de herois',
        loadComponent: () => import('./view-heroes/view-heroes.component').then(m => m.ViewHeroesComponent)
    },
    {
        path: 'view-Studio',
        title: 'Lista de Studios',
        loadComponent: () => import('./view-studio/view-studio.component').then(m => m.ViewStudioComponent)
    },
    {
        path: 'view-team',
        title: 'Lista de Equipes',
        loadComponent: () => import('./view-team/view-team.component').then(m => m.ViewTeamComponent)
    },
    {
        path: 'view-user',
        title: 'Lista Usuarios',
        loadComponent: () => import('./view-user/view-user.component').then(m => m.ViewUserComponent)
    },
]
