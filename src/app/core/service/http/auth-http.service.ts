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
}
    