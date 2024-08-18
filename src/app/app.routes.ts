import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CardsComponent } from './pages/cards/cards.component';
import { DescriptionHeroesComponent } from './pages/descriptionHeroes/description-heroes.component';
import { EmConstrucaoComponent } from './pages/em-construcao/em-construcao.component';

export const routes: Routes = [
    {
        path: '',
        title: 'Home_heroes',
        component: HomeComponent,
    },
    {
        path: 'cards',
        title: 'Cards_about',
        component: CardsComponent,
        children:[
            {
                path: 'descriptionHeroes',
                title: 'Descripstion_heroes',
                component: DescriptionHeroesComponent
            },
        ]
    },
    
    {
        path: 'em-construcao',
        title: 'Em_contrucao',
        component: EmConstrucaoComponent
    },
    { path: '**', redirectTo: '' }
];
