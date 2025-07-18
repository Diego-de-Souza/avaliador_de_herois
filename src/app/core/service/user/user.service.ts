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

  
}
