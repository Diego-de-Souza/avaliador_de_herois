import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HeroisModel} from '../Model/herois.model';

@Injectable({
  providedIn: 'root'
})
export class HeroisService {

  private apiUrl = 'https://api.exemplo.com/heroes'; // URL da sua API

  constructor(private http: HttpClient) { }

  searchHeroes(anoLancamento: Number): Observable<HeroisModel[]> {
    const params = new HttpParams().set('year', anoLancamento.toString());
    return this.http.get<HeroisModel[]>(this.apiUrl, { params });
  }
}
