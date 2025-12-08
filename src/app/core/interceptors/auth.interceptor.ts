import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const sessionToken = localStorage.getItem('session_token');
  
  let authReq = req.clone({
    withCredentials: true
  });

  //adicionado, porque o vercel não funciona com cookies
  if (sessionToken) {
    authReq = authReq.clone({
      setHeaders: {
        'X-Session-Token': sessionToken
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Token expirado - fazendo logout forçado');
        
        authService.forceLogout();
      }
      
      return throwError(() => error);
    })
  );
};