import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CardsComponent } from './pages/cards/cards.component';
import { DescriptionHeroesComponent } from './pages/descriptionHeroes/description-heroes.component';
import { EmConstrucaoComponent } from './pages/em-construcao/em-construcao.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { CadastroDadosComponent } from './pages/cadastro-dados/cadastro-dados.component';

export const routes: Routes = [
    // {
    //     path: '',
    //     title: 'Home_heroes',
    //     component: HomeComponent,
    // },
    {
        path: 'cadastroUser',
        title: 'Cadastro',
        component: CadastroComponent
    },
    {
        path: '',
        title: 'cadastro Dados',
        component: CadastroDadosComponent
    },
    {
        path: 'login',
        title: 'login',
        component: LoginComponent
    },
    {
        path: 'cards',
        title: 'Cards_about',
        component: CardsComponent,
    },
    {
        path: 'descriptionHeroes',
        title: 'Description_heroes',
        component: DescriptionHeroesComponent
    },
    {
        path: 'em-construcao',
        title: 'Em_contrucao',
        component: EmConstrucaoComponent
    },
    { path: '**', redirectTo: '' }
];
