import { Routes } from "@angular/router";
import { plansGuard } from "../../../guard/plans.guard";


export const routesGames: Routes = [
    {
        path: '',
        title: 'Selecao Jogos',
        loadComponent: () => import('./game-selection/game-selection.component').then(m => m.GameSelectionComponent)
    },
    {
        path: 'memory-game',
        title: 'Memory Game',
        loadComponent: () => import('./memory-game/memory-game.component').then(m => m.MemoryGameComponent)
    },
    {
        path: 'hero-battle',
        title: 'Hero Battle',
        canActivate: [plansGuard],
        loadComponent: () => import('./hero-battle/hero-battle').then(m => m.HeroBattle)    
    }
]