import { Routes } from "@angular/router";


export const routesEcommerce: Routes = [
    {
        path: '',
        title: 'E-commerce',
        loadComponent: () => import('./ecommerce.component').then(m => m.EcommerceComponent)
    }
]