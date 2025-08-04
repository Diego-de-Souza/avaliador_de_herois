import { Routes } from "@angular/router";
import { cartGuard } from "../../guard/cart-guard.guard";

export const routesShopping: Routes = [
  {
    path: 'plans',
    loadComponent: () => import('./plans/plans.component').then(m => m.PlansComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
    canActivate: [cartGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [cartGuard]
  },
  {
    path: 'payment-success',
    loadComponent: () => import('./payment-sucess/payment-sucess.component').then(m => m.PaymentSucessComponent),
    canActivate: [cartGuard]
  },
  {
    path: '', 
    redirectTo: 'plans',
    pathMatch: 'full'
  }
]