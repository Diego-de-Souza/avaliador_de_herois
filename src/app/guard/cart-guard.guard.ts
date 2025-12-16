import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/service/auth/auth.service';

export const cartGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const dataUser = authService.getUser()

    if (!dataUser) {
      console.error('Acesso negado: Usuário não logado para acessar carrinho.');
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Token inválido:', error);
    sessionStorage.removeItem('access_token');
    router.navigate(['/login']);
    return false;
  }
};