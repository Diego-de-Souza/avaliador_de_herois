import { Routes } from '@angular/router';

import { EmConstrucaoComponent } from './features/em-construcao/em-construcao.component';
import { LoginComponent } from './features/login/login.component';
import { guardPlataformaGuard } from './guard/guard-plataforma.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Home_heroes',
    loadComponent: () => import('./features/web-main/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro-usuario',
    title: 'Cadastro Usuario',
    loadComponent: () => import('./features/login/cadastro-usuario/cadastro-usuario.component').then(m => m.CadastroUsuarioComponent)
  },
  {
    path: 'em-construcao',
    title: 'Em_construção',
    loadComponent: () => import('./features/em-construcao/em-construcao.component').then(m => m.EmConstrucaoComponent)
  },
  {
    path: 'webmain',
    loadChildren: () => import('./features/web-main/web-main.routes').then(m => m.routesWebMain)
  },
  {
    path: 'plataforma',
    // canActivate: [guardPlataformaGuard],
    loadChildren: () => import('./features/plataforma/plataforma.routes').then(m => m.routesPlataforma)
  },
  { path: '**', redirectTo: '' },
];
