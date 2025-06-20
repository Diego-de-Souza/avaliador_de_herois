import { Routes } from '@angular/router';

import { HomeComponent } from './features/web-main/home/home.component';
import { CardsComponent } from './features/web-main/cards/cards.component';
import { DescriptionHeroesComponent } from './features/web-main/descriptionHeroes/description-heroes.component';
import { EmConstrucaoComponent } from './features/em-construcao/em-construcao.component';
import { LoginComponent } from './features/login/login.component';
import { CadastroDadosComponent } from './features/plataforma/cadastro-dados/cadastro-dados.component';
import { CadastroUsuarioComponent } from './features/plataforma/cadastro-usuario/cadastro-usuario.component';
import { CadastroStudioComponent } from './features/plataforma/cadastro-studio/cadastro-studio.component';
import { CadastroTeamComponent } from './features/plataforma/cadastro-team/cadastro-team.component';
import { BuscaHeroesComponent } from './features/web-main/busca-heroes/busca-heroes.component';
import { UsuarioComponent } from './features/plataforma/usuario/usuario.component';
import { AboutComponent } from './features/web-main/about/about.component';
import { ViewStudioComponent } from './features/plataforma/view-studio/view-studio.component';
import { ViewTeamComponent } from './features/plataforma/view-team/view-team.component';
import { ViewUserComponent } from './features/plataforma/view-user/view-user.component';
import { ViewHeroesComponent } from './features/plataforma/view-heroes/view-heroes.component';
import { CadastroArtigosComponent } from './features/plataforma/cadastro-artigos/cadastro-artigos.component';
import { CadastroCuriosidadesComponent } from './features/plataforma/cadastro-curiosidades/cadastro-curiosidades.component';
import { ViewArtigosComponent } from './features/plataforma/view-artigos/view-artigos.component';
import { ViewCuriosidadesComponent } from './features/plataforma/view-curiosidades/view-curiosidades.component';
import { DashbordComponent } from './features/plataforma/dashbord/dashbord.component';
import { UserConfigComponent } from './features/plataforma/user-config/user-config.component';

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
  {
    path: 'cadastro/artigos',
    title: 'Cadastro de Artigos',
    component: CadastroArtigosComponent
  },
  {
    path: 'view-artigos',
    title: 'Lista de Artigos',
    component: ViewArtigosComponent
  },
  {
    path: 'cadastro/curiosidades',
    title: 'Cadastro de Curiosidades',
    component: CadastroCuriosidadesComponent
  },
  {
    path: 'view-curiosidades',
    title: 'Lista de Curiosidades',
    component: ViewCuriosidadesComponent
  },
  {
    path: 'user-config',
    title: 'Pagina de configurações',
    component: UserConfigComponent
  },
  {
    path: 'plataforma/dashboard',
    title: 'Dashboard',
    component: DashbordComponent
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
  { path: '**', redirectTo: '' },
];
