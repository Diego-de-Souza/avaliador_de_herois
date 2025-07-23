import { Routes } from "@angular/router";


export const routesWebMain: Routes = [
  {
    path: 'about',
    title: 'Sobre nós',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'artigos',
    title: 'Artigos',
    loadComponent: () => import('./artigos/artigos-page.component').then(m => m.ArtigosPageComponent)
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
    path: 'conteudo',
    loadChildren: () => import('./conteudo/conteudo.routes').then(m => m.routesConteudo)
  },
]
