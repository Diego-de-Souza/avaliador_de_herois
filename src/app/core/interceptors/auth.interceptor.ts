import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('access_token');
  const http = inject(HttpClient);
  const router = inject(Router);

  // Clona a requisição e adiciona Authorization, se existir token
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return from(http.get<{ access_token: string }>('/auth/refresh')).pipe(
          switchMap((response) => {
            const newToken = response.access_token;
            
            sessionStorage.setItem('access_token', newToken);

            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });

            return next(newAuthReq);
          }),
          catchError((refreshError) => {
            console.error('Erro ao tentar renovar o token:', refreshError);
            sessionStorage.clear();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
