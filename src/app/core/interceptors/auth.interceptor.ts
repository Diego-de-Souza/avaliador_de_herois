import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const sessionToken = localStorage.getItem('session_token');
  
  const skipAuthUrls = [
    'https://viacep.com.br',
    'https://apis.google.com',
    'https://accounts.google.com',
    'https://www.google.com',
  ];

  const shouldSkipAuth = skipAuthUrls.some(url => req.url.startsWith(url));

  if (shouldSkipAuth) {
    return next(req);
  }

  const isApiRequest = req.url.startsWith(environment.apiURL) || 
                       req.url.startsWith('/api') || 
                       !req.url.startsWith('http'); 

  if (!isApiRequest) {
    return next(req);
  }

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