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
import { ViewStudioComponent } from './pages/plataforma/view-studio/view-studio.component';
import { ViewTeamComponent } from './pages/plataforma/view-team/view-team.component';
import { ViewUserComponent } from './pages/plataforma/view-user/view-user.component';
import { ViewHeroesComponent } from './pages/plataforma/view-heroes/view-heroes.component';
import { ArtigosComponent } from './components/artigos/artigos.component';
import { FormArticleComponent } from './pages/form-article/form-article.component';

export const routes: Routes = [
  //rota principal
  {
    path: '',
    title: 'Home_heroes',
    component: HomeComponent,
  },
  //rota da entrada da plataforma de acesso do usuario manager
  {
    path: 'cadastro',
    title: 'Cadastro',
    component: UsuarioComponent,
  },
  //rotas do usuario da plataforma
  {
    path: 'view-user',
    title: 'Lista Usuarios',
    component: ViewUserComponent,
  },
  { //rota de cadastro de novo usuário
    path: 'cadastro/user',
    title: 'Cadastro de Usuário',
    component: CadastroUsuarioComponent,
  },
  //rotas dos herois
  {
    path: 'view-heroes',
    title: 'Lista de herois',
    component: ViewHeroesComponent
  },
  {
    path: 'cadastro/heroi',
    title: 'Cadastro de Herói',
    component: CadastroDadosComponent, // Renderiza o cadastro do herói
  },
  {
    path: 'cadastro/heroi/:id',
    title: 'Atualizacao de Herói',
    component: CadastroDadosComponent
  },
  //rotas do studio
  {
    path: 'view-Studio',
    title: 'Lista de Studios',
    component: ViewStudioComponent,
  },
  {
    path: 'cadastro/studio',
    title: 'Cadastro de Studio',
    component: CadastroStudioComponent, // Renderiza o cadastro do Studio
  },
  {
    path: 'cadastro/studio/:id',
    title: 'Cadastro de Studio',
    component: CadastroStudioComponent
  },
  // rotas das equipes
  {
    path: 'view-team',
    title: 'Lista de Equipes',
    component: ViewTeamComponent,
  },
  {
    path: 'cadastro/team/:id',
    title: 'Cadastro de Studio',
    component: CadastroTeamComponent, // Renderiza o cadastro do Team
  },
  {
    path: 'cadastro/team',
    title: 'Cadastro de Equipe',
    component: CadastroTeamComponent, // Renderiza o cadastro da equipe
  },
  //rota de login, parte mescla da aplicação acesso a algumas partes do site ou da plataforma
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  //rotas de amostragem dos herois
  {
    path: 'cards',
    title: 'Cards_about',
    component: CardsComponent,
  },
  {
    path: 'descriptionHeroes/:id',
    title: 'Description_heroes',
    component: DescriptionHeroesComponent,
  },
  {
    path: 'busca_heroes',
    title: 'Busca de heróis',
    component: BuscaHeroesComponent
  },
  {
    path: 'about',
    title: 'Sobre nós',
    component: AboutComponent
  },
  // rota de construcao
  {
    path: 'em-construcao',
    title: 'Em_construção',
    component: EmConstrucaoComponent,
  },
  // Rota para o formulário de cadastro de artigos
  {
    path: 'cadastro_artigos',
    title: 'Cadastro de Artigo',
    component: FormArticleComponent,  // Renderiza o cadastro do artigo
  },
  {
    path: 'cadastro_artigos/:id',
    title: 'Atualizacao de Artigo',
    component: FormArticleComponent,
  },

  { path: '**', redirectTo: '' },
];
