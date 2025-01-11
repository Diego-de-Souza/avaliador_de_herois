import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getFindOneUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/find-one-user/${id}`);
  }

  postRegisterUser(userData: any): Observable<ArrayBuffer>{
    const data = {data: userData};
    return this.http.post<ArrayBuffer>(`${this.apiUrl}/user/register-user`, data);
  }

  putUpdateUser(userId: number | null, userData: FormData): Observable<any> {
    const data = {data: userData};
    return this.http.put(`${this.apiUrl}/user/update/${userId}`, data);
  }
  
  postLogin(userData: any): Observable<ArrayBuffer>{
    const data = {data: userData}
    return this.http.post<ArrayBuffer>(`${this.apiUrl}/user/signin`, data);
  }
  
}
