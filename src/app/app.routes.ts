import { Routes } from '@angular/router';

import { guardPlataformaGuard } from './guard/guard-plataforma.guard';
import { plansGuard } from './guard/plans.guard';

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
    path: 'validate-two-fa',
    title: 'Validar 2FA',
    loadComponent: () => import('./features/login/validate-two-fa/validate-two-fa').then(m => m.ValidateTwoFa)
  },
  {
    path: 'em-construcao',
    title: 'Em_construção',
    canActivate: [plansGuard],
    loadComponent: () => import('./features/em-construcao/em-construcao.component').then(m => m.EmConstrucaoComponent)
  },
  {
    path: 'webmain',
    loadChildren: () => import('./features/web-main/web-main.routes').then(m => m.routesWebMain)
  },
  {
    path: 'plataforma',
    canActivate: [guardPlataformaGuard],
    loadChildren: () => import('./features/plataforma/plataforma.routes').then(m => m.routesPlataforma)
  },
  {
    path: 'shopping',
    loadChildren: () => import('./features/shopping/shopping.routes').then(m => m.routesShopping)
  },
  { path: '**', redirectTo: '' },
];
