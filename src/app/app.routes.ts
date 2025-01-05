import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CardsComponent } from './pages/cards/cards.component';
import { DescriptionHeroesComponent } from './pages/descriptionHeroes/description-heroes.component';
import { EmConstrucaoComponent } from './pages/em-construcao/em-construcao.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { CadastroDadosComponent } from './pages/cadastro/cadastro-dados/cadastro-dados.component';
import { CadastroUsuarioComponent } from './pages/cadastro/cadastro-usuario/cadastro-usuario.component';
import { CadastroStudioComponent } from './pages/cadastro/cadastro-studio/cadastro-studio.component';
import { CadastroTeamComponent } from './pages/cadastro/cadastro-team/cadastro-team.component';
import { BuscaHeroesComponent } from './pages/busca-heroes/busca-heroes.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Home_heroes',
    component: HomeComponent,
  },
  {
    path: 'cadastro',
    title: 'Cadastro',
    component: CadastroComponent, // Renderiza o HTML principal
    children: [
      {
        path: 'user',
        title: 'Cadastro de Usuário',
        component: CadastroUsuarioComponent, // Renderiza o cadastro do usuário
      },
      {
        path: 'heroi',
        title: 'Cadastro de Herói',
        component: CadastroDadosComponent, // Renderiza o cadastro do herói
      },
      {
        path: 'studio',
        title: 'Cadastro de Studio',
        component: CadastroStudioComponent, // Renderiza o cadastro do Studio
      },
      {
        path: 'team',
        title: 'Cadastro de Equipe',
        component: CadastroTeamComponent, // Renderiza o cadastro da equipe
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'user', // Redireciona para uma página padrão (ex.: Cadastro de Usuário)
      },
    ],
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: 'cards',
    title: 'Cards_about',
    component: CardsComponent,
  },
  {
    path: 'descriptionHeroes',
    title: 'Description_heroes',
    component: DescriptionHeroesComponent,
  },
  {
    path: 'busca_heroes',
    title: 'Busca de heróis',
    component: BuscaHeroesComponent
  },
  {
    path: 'em-construcao',
    title: 'Em_construção',
    component: EmConstrucaoComponent,
  },
  { path: '**', redirectTo: '' },
];
