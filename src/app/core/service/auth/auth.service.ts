import { Injectable, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { EncryptionUtil } from '../../../shared/utils/encryption.utils';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  private refreshUrl = environment.apiURL;

  constructor(private userService: UserService, private http: HttpClient) { }

  ngOnInit(): void {
    // Verificação inicial ao carregar a página
    this.checkTokenExpiration();
  
    // Verificar periodicamente a cada 5 minutos (300000 ms)
    setInterval(() => {
      this.checkTokenExpiration();
    }, 300000);
  }
  
  async login(userData:any): Promise<any>{
    try{

      userData.password = EncryptionUtil.encrypt(userData.password);
      
      const userAccess:any = await lastValueFrom(this.userService.postLogin(userData));

      if (userAccess) {
        if (userAccess.acess_token) {
          localStorage.setItem('access_token', userAccess.acess_token);
          // Armazenando o tempo de expiração do token
          const expirationTime = Date.now() + (60 * 60 * 1000); 
          localStorage.setItem('token_expiration', expirationTime.toString());
        }
  
        if (userAccess.refresh_token) {
          document.cookie = `refresh_token=${userAccess.refresh_token}; Secure; HttpOnly;`;
        }
  
        if (userAccess.role) {
          localStorage.setItem('role', JSON.stringify(userAccess.role));
        }

        if(userAccess.user_id){
          localStorage.setItem('user_id', userAccess.user_id)
        }

        if(userAccess.nickname){
          localStorage.setItem('nickname', userAccess.nickname)
        }
      }
      
      return true
    }catch(error){
      console.error('Erro no login:', error);
      throw new Error('Erro ao realizar login. Tente novamente.');
    }
  }

  private getRefreshToken(): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; refresh_token=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken(); 

    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    return this.http.post(`${this.refreshUrl}/auth`, { refresh_token: refreshToken }).pipe(
      catchError(error => {
        console.error('Erro ao tentar atualizar o access token', error);
        return throwError('Erro ao atualizar o token');
      })
    );
  }

  isTokenExpired(token: string): boolean {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decodifica o JWT e analisa o payload
      const exp = tokenPayload?.exp;

      if (!exp) return false;

      const expiryDate = new Date(exp * 1000);  // exp vem em segundos, convertendo para milissegundos
      const currentDate = new Date();

      return currentDate > expiryDate;  // Se o token tiver expirado
    } catch (e) {
      console.error('Erro ao decodificar o token', e);
      return false;  // Em caso de erro, assume-se que o token está inválido
    }
  }

  // Método para verificar validade do access_token
  checkTokenValidity(token: string | null): boolean {
    if (!token) return false;

    return !this.isTokenExpired(token); // Se o token estiver expirado, retorne false
  }

  // Tenta buscar o access_token do localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Método para lidar com refresh do token automaticamente
  refreshTokenIfExpired(): Observable<any> {
    const accessToken = this.getAccessToken();

    // Se não tiver token ou o token estiver expirado, tenta fazer refresh
    if (accessToken && !this.checkTokenValidity(accessToken)) {
      return this.refreshAccessToken();
    }

    // Se não precisar de refresh, retorne um observable vazio ou do tipo success
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  checkTokenExpiration(): void {
    const expirationTime = localStorage.getItem('token_expiration');
    
    if (expirationTime) {
      const currentTime = Date.now();
      if (currentTime >= Number(expirationTime)) {
        // O token expirou, deve renovar
        this.refreshTokenIfExpired();
      }
    }
  }

}
