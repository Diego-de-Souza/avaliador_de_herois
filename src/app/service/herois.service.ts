import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HeroisModel} from '../Model/herois.model';
import { HeroisMenuModel } from '../Model/heroisMenu.model';

@Injectable({
  providedIn: 'root'
})
export class HeroisService {

  private apiUrl = 'http://localhost:3000'; // URL da sua API

  constructor(private http: HttpClient) { }

  //rotas do heroes
  heroRecord(data: FormData): Observable<ArrayBuffer> {
    return this.http.post<ArrayBuffer>(`${this.apiUrl}/herois`, data);
  }

  //rotas do team
  getOneTeam(id: number | null): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/herois/team/find-one-team/:${id}`);
  }

  postRegisterTeam(data: FormData): Observable<ArrayBuffer>{
    return this.http.post<ArrayBuffer>(`${this.apiUrl}/team`, data);
  }

  putUpdateTeam(userId: number | null, data: FormData): Observable<ArrayBuffer>{
    return this.http.put<ArrayBuffer>(`${this.apiUrl}/herois/team/update/:${userId}`, data);
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
    return this.http.delete<any>(`${this.apiUrl}/studio/delete-one-studio/:${id}`,{
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  getOneStudio(id:number | null): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/studio/find-one-studio/:${id}`,{
      headers:{
        'Content-Type': 'application/json',
      }
    });
  }

  postRegisterStudio(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/studio`, data, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
  }

  putUpdateStudio(id:Number|null, data: any): Observable<any>{
    return this.http.put<ArrayBuffer>(`${this.apiUrl}/studio/update/:${id}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }


  

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
