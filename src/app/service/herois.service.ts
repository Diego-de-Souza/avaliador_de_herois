import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HeroisModel} from '../Model/herois.model';
import { HeroisMenuModel } from '../Model/heroisMenu.model';

@Injectable({
  providedIn: 'root'
})
export class HeroisService {

  private apiUrl = 'http://localhost:3000'; // URL da sua API

  constructor(private http: HttpClient) { }

  getDadosMenu(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/menu_principal/getAll`)
  }

  getAllHeroes(): Observable<HeroisMenuModel[]> {
    return this.http.get<HeroisMenuModel[]>(this.apiUrl);
  }

  searchHeroesPublisher(publisher: number): Observable<HeroisModel[]> {
    const params = new HttpParams().set('publisher', publisher);
    return this.http.get<HeroisModel[]>(`${this.apiUrl}/editora/`, { params });
  }

  searchHeroesTeam(team: string): Observable<HeroisModel[]> {
    const params = new HttpParams().set('team',team);
    return this.http.get<HeroisModel[]>(this.apiUrl, {params})
  }

  searchHeroesOrigin(origin: string): Observable<HeroisModel[]> {
    const params = new HttpParams().set('origin', origin);
    return this.http.get<HeroisModel[]>(this.apiUrl, {params});
  }

  searchHeroesReleaseDate(anoLancamento: Number): Observable<HeroisModel[]> {
    const params = new HttpParams().set('year', anoLancamento.toString());
    return this.http.get<HeroisModel[]>(this.apiUrl, { params });
  }

  searchHeroesMorality(morality: string): Observable<HeroisModel[]> {
    const params = new HttpParams().set('morality',morality);
    return this.http.get<HeroisModel[]>(this.apiUrl, {params});
  }

  searchHeroesSexy(sexy: string): Observable<HeroisModel[]> {
    const params = new HttpParams().set('sexy', sexy);
    return this.http.get<HeroisModel[]>(this.apiUrl,{params});
  }
}
