import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../core/service/auth/auth.service';

export const guardPlataformaGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  const bypassRoutes = [
    '/plataforma/user-config',
  ];

  if (bypassRoutes.includes(state.url)) {
    return true;
  }

  const dataUser = authService.getUser();
  if (!dataUser) {
    console.error('Acesso negado: Usuário não encontrado.');
    return false;
  }
  if (dataUser.role !== "admin" && dataUser.role !== "root") {
    return false;
  }

  return true;
};