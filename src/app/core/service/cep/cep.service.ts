import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly http = inject(HttpClient);
  private readonly apiURL = 'https://viacep.com.br/ws';

  buscarCep(cep: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/${cep}/json`);
  }
}
