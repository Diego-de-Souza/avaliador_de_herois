import { inject, Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { EncryptionUtil } from '../../../shared/utils/encryption.utils';
import { BehaviorSubject, lastValueFrom, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthHttpService } from '../http/auth-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private readonly userService = inject(UserService);
  private readonly http = inject(HttpClient);
  private readonly authHttpService = inject(AuthHttpService);
  
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public user$ = this.userSubject.asObservable();
  private readonly router = inject(Router);

  private getUserFromStorage(): any {
    try {
      const user = localStorage.getItem('user');
      const parsedUser = user ? JSON.parse(user) : null;
      return parsedUser;
    } catch {
      console.log(' Erro ao ler localStorage');
      return null;
    }
  }

  async login(userData: any): Promise<any> {
    try {
      const response: any = await lastValueFrom(this.userService.postLogin(userData));
      if (response && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('session_token', response.session_token);
        this.userSubject.next(response.user);
      }
      return {
        has_totp: response.has_totp,
        status: true
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Erro ao realizar login. Tente novamente.');
    }
  }

  async logout(): Promise<void> {
    await lastValueFrom(this.userService.logout());
    localStorage.removeItem('session_token');
    this.clearUserData();
    this.router.navigate(['/login']);
    return;
  }

  async logoutAllSessions(): Promise<any> {
    const response = await lastValueFrom(this.userService.logoutAllSessions());
    localStorage.removeItem('session_token');
    this.clearUserData();
    this.router.navigate(['/login']);
    return response;
  }

  private clearUserData(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  forceLogout(): void {
    this.clearUserData();
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  getUser(): any {
    return this.userSubject.value;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  async checkSession(): Promise<boolean> {
    try {

      const response: any = await lastValueFrom(
        this.userService.checkSession(),
      );

      if (response && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        this.userSubject.next(response.user);
        return true;
      }
      
      localStorage.removeItem('user');
      this.userSubject.next(null);
      return false;
    } catch (error) {
      localStorage.removeItem('user');
      this.userSubject.next(null);
      return false;
    }
  }

  async validateGoogleLogin(idToken: string): Promise<any> {
    try {
      const response: any = await lastValueFrom(this.userService.validateGoogleLogin(idToken));
      if (response && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        this.userSubject.next(response.user); 
        return response;
      } else {
        throw new Error('Resposta inválida do servidor ao validar login do Google.');
      }
    } catch (error) {
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
      return response.dataUnit[0];
    } catch (error) {
      console.error('Erro ao habilitar 2FA:', error);
      throw new Error('Erro ao habilitar a autenticação de dois fatores. Tente novamente.');
    }
  }

  async generateCodeMFA(type: number): Promise<string | null> {
    let typeCanal = '';
    switch (type) {
      case 1: typeCanal = 'email'; break;
      case 2: typeCanal = 'sms'; break;
      case 3: typeCanal = 'whatsapp'; break;
      default: typeCanal = '';
    }
    try {
      await lastValueFrom(this.userService.generateCodeMFA(typeCanal));
      return 'Código enviado com sucesso';
    } catch (error) {
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
    switch (type) {
      case 1: typeCanal = 'email'; break;
      case 2: typeCanal = 'sms'; break;
      case 3: typeCanal = 'whatsapp'; break;
      default: typeCanal = '';
    }
    try {
      const response: any = await lastValueFrom(this.userService.validateCodeMFA(code, typeCanal));
      return response;
    } catch (error) {
      console.error('Erro ao validar o código MFA:', error);
      throw new Error('Erro ao validar o código de autenticação de múltiplos fatores. Tente novamente.');
    }
  }

  async getUserSettings(type: string): Promise<any> {
    try {
      const response: any = await lastValueFrom(this.userService.getUserSettings(type));
      return response.data;
    } catch (error) {
      // Silenciar erro
    }
  }

  async codeSent(type: number, data: string): Promise<any> {
    let typeCanal = '';
    switch (type) {
      case 1: typeCanal = 'email'; break;
      case 2: typeCanal = 'sms'; break;
      case 3: typeCanal = 'whatsapp'; break;
      default: typeCanal = '';
    }
    try {
      await lastValueFrom(this.userService.codeSent(typeCanal, data));
      return 'Código enviado com sucesso';
    } catch (error) {
      console.error('Erro ao gerar código de redefinição de senha:', error);
      throw new Error('Erro ao gerar código de redefinição de senha. Tente novamente.');
    }
  }

  async logoutSession(sessionId: string): Promise<any> {
    return await lastValueFrom(this.userService.logoutSession(sessionId));
  }

  async getActiveSessions(): Promise<any> {
    try {
      const response: any = await lastValueFrom(this.userService.getActiveSessions());
      return response;
    } catch (error) {
      console.error('Erro ao buscar sessões ativas:', error);
      throw new Error('Erro ao buscar sessões ativas. Tente novamente.');
    }
  }

  async registerAcessoUser(): Promise<void>{
    try{
      await lastValueFrom(this.authHttpService.registerAcessoUser());
    } catch (error: any) {
      console.error('Erro ao registrar acesso do usuário:', error);
      throw new Error('Erro ao registrar acesso do usuário. Tente novamente.');
    }
  }
}