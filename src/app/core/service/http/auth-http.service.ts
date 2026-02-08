import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AuthHttpService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiURL;

    registerAcessoUser(): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/register-acesso-user`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    forgotPassword(email: string, cpf: string, dob: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { email, cpf, dob });
    }

    changePasswordClient(id: string, newPassword: string): Observable<any> {
        console.log('http: ',id, newPassword);
        return this.http.post<any>(`${this.apiUrl}/auth/change-password-client`, {
            newPassword: newPassword,
            id: id
        });
    }
}
    