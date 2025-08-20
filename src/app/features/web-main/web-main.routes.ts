import { Routes } from "@angular/router";
import { plansGuard } from "../../guard/plans.guard";


export const routesWebMain: Routes = [
    {
        path: 'about',
        title: 'Sobre nós',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'busca_heroes',
        title: 'Busca de heróis',
        loadComponent: () => import('./busca-heroes/busca-heroes.component').then(m => m.BuscaHeroesComponent)
    },
    {
        path: 'cards',
        title: 'Cards_about',
        loadComponent: () => import('./cards/cards.component').then(m => m.CardsComponent)
    },
    {
        path: 'descriptionHeroes/:id',
        title: 'Description_heroes',
        loadComponent: () => import('./descriptionHeroes/description-heroes.component').then(m => m.DescriptionHeroesComponent)
    },
    {
        path: 'quiz',
        canActivate: [plansGuard],
        loadChildren: () => import('./quiz/quiz.routes').then(m => m.routesWebMainQuiz)
    },
    {
        path: 'conteudo',
        loadChildren: () => import('./conteudo/conteudo.routes').then(m => m.routesConteudo)
    },
    {
        path: 'games',
        loadChildren: () => import('./games/games.routes').then(m => m.routesGames)
    }
]