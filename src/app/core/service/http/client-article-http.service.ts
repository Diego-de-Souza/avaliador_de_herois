import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClientArticle, ClientArticleRequest, ClientArticleListResponse } from '../../interface/client-article.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientArticleHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiURL}/client/articles`;

  create(article: ClientArticleRequest): Observable<ClientArticle> {
    return this.http.post<ClientArticle>(this.apiUrl, article);
  }

  getAll(userId: number): Observable<ClientArticleListResponse> {
    const params = new HttpParams().set('usuario_id', userId.toString());
    return this.http.get<ClientArticleListResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ClientArticle> {
    return this.http.get<ClientArticle>(`${this.apiUrl}/${id}`);
  }

  update(id: number, article: Partial<ClientArticleRequest>): Observable<ClientArticle> {
    return this.http.put<ClientArticle>(`${this.apiUrl}/${id}`, article);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deleteMany(ids: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-many`, { ids });
  }
}
