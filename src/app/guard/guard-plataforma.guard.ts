import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../core/service/auth/auth.service';

export const guardPlataformaGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  
  const accessToken = sessionStorage.getItem('access_token');

  if(!accessToken){
    console.error('Acesso negado: Token de acesso não encontrado.');
    return false;
  }

  const dataUser = authService.decodeJwt(accessToken);

  if(dataUser.role !== "admin" ){
    return false;
  }
  return true;
};
