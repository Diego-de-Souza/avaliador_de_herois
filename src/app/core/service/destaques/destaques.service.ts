import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestaquesService {
    private readonly http = inject(HttpClient);
    
    getDestaques(): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/highlights`);
    }   
}