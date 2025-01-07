import { Routes } from '@angular/router';

import { HomeComponent } from './pages/web-main/home/home.component';
import { CardsComponent } from './pages/web-main/cards/cards.component';
import { DescriptionHeroesComponent } from './pages/web-main/descriptionHeroes/description-heroes.component';
import { EmConstrucaoComponent } from './pages/em-construcao/em-construcao.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroDadosComponent } from './pages/plataforma/cadastro-dados/cadastro-dados.component';
import { CadastroUsuarioComponent } from './pages/plataforma/cadastro-usuario/cadastro-usuario.component';
import { CadastroStudioComponent } from './pages/plataforma/cadastro-studio/cadastro-studio.component';
import { CadastroTeamComponent } from './pages/plataforma/cadastro-team/cadastro-team.component';
import { BuscaHeroesComponent } from './pages/web-main/busca-heroes/busca-heroes.component';
import { UsuarioComponent } from './pages/plataforma/usuario/usuario.component';
import { AboutComponent } from './pages/web-main/about/about.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Home_heroes',
    component: HomeComponent,
  },
  { //rota da entrada da plataforma de acesso do usuario manager
    path: 'cadastro',
    title: 'Cadastro',
    component: UsuarioComponent, 
  },
  { //rota de cadastro de novo usuário
    path: 'cadastro/user',
    title: 'Cadastro de Usuário',
    component: CadastroUsuarioComponent,
  },
  { //rota de upadate de usuario já existente no banco
    path: 'update/user:id',
    title: 'Atualização de Usuário',
    component: CadastroUsuarioComponent
  },
  {
    path: 'cadastro/heroi',
    title: 'Cadastro de Herói',
    component: CadastroDadosComponent, // Renderiza o cadastro do herói
  },
  {
    path: 'cadastro/studio',
    title: 'Cadastro de Studio',
    component: CadastroStudioComponent, // Renderiza o cadastro do Studio
  },
  {
    path: 'cadastro/team',
    title: 'Cadastro de Equipe',
    component: CadastroTeamComponent, // Renderiza o cadastro da equipe
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user', // Redireciona para uma página padrão (ex.: Cadastro de Usuário)
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
  {
    path: 'about',
    title: 'Sobre nós',
    component: AboutComponent
  },
  { path: '**', redirectTo: '' },
];
