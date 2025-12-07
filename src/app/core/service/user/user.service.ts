import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/user/find-all-user`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteoneUser(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/user/delete-one-user/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  getFindOneUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/find-one-user/${id}`);
  }

  postRegisterUser(userData: any): Observable<ArrayBuffer>{
    const data = {data: userData};
    return this.http.post<ArrayBuffer>(`${this.apiUrl}/user/register-user`, data);
  }

  putUpdateUser(userId: number | null, userData: FormData): Observable<any> {
    const data = {data: userData};
    return this.http.put(`${this.apiUrl}/user/update/${userId}`, data,{
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  postLogin(userData: any): Observable<ArrayBuffer>{
    const data = {data: userData}
    return this.http.post<ArrayBuffer>(`${this.apiUrl}/auth/signin`, data,{
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  validateGoogleLogin(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/google`, { idToken });
  }

  changePassword(newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/change-password`, { newPassword });
  }

  enable2FA(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/qrcode/totp`, {});
  }

  generateCodeMFA(typeCanal: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/generate/mfa`, { typeCanal });
  }

  disable2FA(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/disable-2fa`, {});
  }

  validate2FA(code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/validate/totp`, { code });
  }

  validateCodeMFA(code: string, type: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/validate/mfa`, { code, type });
  }

  getUserSettings(type: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/settings`, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: { type }
    });
  }

  codeSent(typeCanal: string, data: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/generate/code-password`, { typeCanal, data });
  }

  checkSession(): Observable<any>{
    return this.http.get(`${this.apiUrl}/auth/me`, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { 
      withCredentials: true 
    });
  }

}
