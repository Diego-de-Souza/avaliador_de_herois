import { Injectable, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { EncryptionUtil } from '../../../shared/utils/encryption.utils';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';


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
      
      const userAccess:any = await lastValueFrom(this.userService.postLogin(userData));

      if (userAccess) {
        sessionStorage.setItem('access_token', userAccess.access_token);
      }

      const result = {
        has_totp: userAccess.has_totp,
        status: true
      }
      
      return result;
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

  decodeJwt(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Erro ao decodificar o JWT:', error);
      return null;
    }
  }

  isPremium(): boolean {
    const access_token = this.getAccessToken()!;
    const dados = this.decodeJwt(access_token);
    if(dados.access === "premium"){
      return true;
    }else{
      return false;
    }
    
  }

  async validateGoogleLogin(idToken:string): Promise<any>{
    try{
      const response:any = await lastValueFrom(this.userService.validateGoogleLogin(idToken));

      if (response) {
        sessionStorage.setItem('access_token', response.access_token);
        return response;
      } else {
        throw new Error('Resposta inválida do servidor ao validar login do Google.');
      }
    }catch(error){
      console.error('Erro ao validar login do Google:', error);
      throw new Error('Erro ao validar login do Google. Tente novamente.');
    }
  }

  async changePassword(newPassword: string): Promise<any> {
    try {
      const encryptedPassword = EncryptionUtil.encrypt(newPassword);
      const response = await lastValueFrom(this.userService.changePassword(encryptedPassword));
      return response;
    } catch (error) {
      console.error('Erro ao alterar a senha:', error);
      throw new Error('Erro ao alterar a senha. Tente novamente.');
    }
  }

  async enable2FA(): Promise<string | null> {
    try {
      const response: any = await lastValueFrom(this.userService.enable2FA());
      return response.dataUnit[0]; // Retorna o QR code para o usuário escanear
    } catch (error) {
      console.error('Erro ao habilitar 2FA:', error);
      throw new Error('Erro ao habilitar a autenticação de dois fatores. Tente novamente.');
    }
  }

  async generateCodeMFA(type: number): Promise<string | null> {
    let typeCanal = '';
    switch(type){
      case 1:
        typeCanal = 'email';
        break;
      case 2:
        typeCanal = 'sms';
        break;
      case 3:
        typeCanal = 'whatsapp';
        break;
      default:
        typeCanal = '';
    }

    try{
      await lastValueFrom(this.userService.generateCodeMFA(typeCanal));
      return 'Código enviado com sucesso';
    }catch(error){
      console.error('Erro ao gerar código MFA:', error);
      throw new Error('Erro ao gerar código de autenticação de múltiplos fatores. Tente novamente.');
    }
  }

  async disable2FA(): Promise<boolean> {
    try {
      await lastValueFrom(this.userService.disable2FA());
      return true; 
    } catch (error) {
      console.error('Erro ao desabilitar 2FA:', error);
      throw new Error('Erro ao desabilitar a autenticação de dois fatores. Tente novamente.');
    }
  }

  async validate2FA(code: string): Promise<any> {
    try {
      const response: any = await lastValueFrom(this.userService.validate2FA(code));
      return response;
    } catch (error) {
      console.error('Erro ao validar o código 2FA:', error);
      throw new Error('Erro ao validar o código de autenticação de dois fatores. Tente novamente.');
    }
  }

  async validateCodeMFA(code: string, type: number): Promise<any> {
    let typeCanal = '';
    try {
      switch(type){
        case 1:
          typeCanal = 'email';
          break;
        case 2:
          typeCanal = 'sms';
          break;
        case 3:
          typeCanal = 'whatsapp';
          break;
        default:
          typeCanal = '';
      }
      const response: any = await lastValueFrom(this.userService.validateCodeMFA(code, typeCanal));
      return response;
    } catch (error) {
      console.error('Erro ao validar o código MFA:', error);
      throw new Error('Erro ao validar o código de autenticação de múltiplos fatores. Tente novamente.');
    }
  }

  async getUserSettings(type: string): Promise<any> {
    try{
      const response: any = await lastValueFrom(this.userService.getUserSettings(type));
      return response.data;
    }catch(error){

    }
  }

  async codeSent(type: number, data: string): Promise<any> {
    let typeCanal = '';
    switch(type){
      case 1:
        typeCanal = 'email';
        break;
      case 2:
        typeCanal = 'sms';
        break;
      case 3:
        typeCanal = 'whatsapp';
        break;
      default:
        typeCanal = '';
    }

    try{
      await lastValueFrom(this.userService.codeSent(typeCanal, data));
      return 'Código enviado com sucesso';
    }catch(error){
      console.error('Erro ao gerar código de redefinição de senha:', error);
      throw new Error('Erro ao gerar código de redefinição de senha. Tente novamente.');
    }
  }
}
