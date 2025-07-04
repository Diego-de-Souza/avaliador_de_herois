import { Routes } from "@angular/router";


export const routesPlataforma: Routes = [
    {
        path: '',
        title: 'Plataforma',
        loadComponent: () => import('./plataforma-admin.component').then(m => m.PlataformaAdminComponent)
    },
    {
        path: 'cadastro',
        loadChildren: () => import('./cadastros/cadastros.routes').then(m => m.routesCadastros)
    },
    {
        path: 'view',
        loadChildren: () => import('./views/views.routes').then(m => m.routesViews)
    },
    {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./dashbord/dashbord.component').then(m => m.DashbordComponent)
    },
    {
        path: 'user-config',
        title: 'Pagina de configurações',
        loadComponent: () => import('./user-config/user-config.component').then(m => m.UserConfigComponent)
    },
    {
        path: 'cadastro',
        title: 'Cadastro',
        loadComponent: () => import('./usuario/usuario.component').then(m => m.UsuarioComponent)
    },
]