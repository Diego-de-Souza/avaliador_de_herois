import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeroisModel } from '../../Model/herois.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroisService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiURL;

  //rotas do heroes
  heroRecord(data: FormData): Observable<ArrayBuffer> {
    return this.http.post<ArrayBuffer>(`${this.apiUrl}/herois`, data);
  }

  //rotas do team
  getAllTeam(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/team/find-all-team`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteOneTeam(id: number | null): Observable<any>{
    return this.http.delete(`${this.apiUrl}/team/delete-one-team/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getOneTeam(id: number | null): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/herois/team/find-one-team/${id}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  postRegisterTeam(teamData: any): Observable<any>{
    const data = {data: teamData};
    return this.http.post<ArrayBuffer>(`${this.apiUrl}/team`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  putUpdateTeam(teamId: number | null, teamData: any): Observable<any>{
    const data = {data: teamData};
    return this.http.put<any>(`${this.apiUrl}/team/update/${teamId}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  //rotas do studio
  getAllStudio(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/studio/find-all-studio`,{
      headers:{
        'Content-Type': 'application/json',
      }
    })
  }

  deleteOneStudio(id: number | null): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/studio/delete-one-studio/${id}`,{
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  getOneStudio(id:number | null): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/studio/find-one-studio/${id}`,{
      headers:{
        'Content-Type': 'application/json',
      }
    });
  }

  postRegisterStudio(data: any): Observable<any> {
    const token = sessionStorage.getItem('access_token');
    return this.http.post<any>(`${this.apiUrl}/studio`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  putUpdateStudio(id:Number|null, studioData: any): Observable<any>{
    const data = { data:studioData};
    return this.http.put<ArrayBuffer>(`${this.apiUrl}/studio/update/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
      }
    });
  }

  //rotas dos herois
  getAllHeroes() : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/herois/find-all-heroes`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteOneHero(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/herois/delete-one-hero/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  putUpdateHero(id:number, heroData: any): Observable<any>{
    const data = {data: heroData};
    return this.http.put<any>(`${this.apiUrl}/heroes/update/${id}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getDadosMenu(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/menu_principal/getAll`, {
      headers:{
        'Content-Type': 'application/json'
      }
    })
  }

  searchHeroesByStudio(studioId: number): Observable<HeroisModel[]> {
    return this.http.get<HeroisModel[]>(`${this.apiUrl}/herois/editora/` + studioId, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  searchHeroesTeam(team: string): Observable<HeroisModel[]> {
    return this.http.get<HeroisModel[]>(`${this.apiUrl}/herois/team/` + team, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  searchHeroesReleaseDate(anoLancamento: Number): Observable<HeroisModel[]> {
    return this.http.get<HeroisModel[]>(`${this.apiUrl}/herois/ano_lancamento/` + anoLancamento, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  searchHeroesMorality(morality: string): Observable<HeroisModel[]> {
    return this.http.get<HeroisModel[]>(`${this.apiUrl}/herois/morality/` + morality, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  searchHeroesGenre(genre: string): Observable<HeroisModel[]> {
    return this.http.get<HeroisModel[]>(`${this.apiUrl}/herois/genre/` + genre, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getDataHero(id: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/herois/find-one-hero/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}
