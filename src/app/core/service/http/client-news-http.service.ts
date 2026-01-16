import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClientNews, ClientNewsRequest, ClientNewsListResponse } from '../../interface/client-news.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientNewsHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiURL}/client/news`;

  create(news: ClientNewsRequest): Observable<ClientNews> {
    return this.http.post<ClientNews>(this.apiUrl, news);
  }

  getAll(userId: number): Observable<ClientNewsListResponse> {
    const params = new HttpParams().set('usuario_id', userId.toString());
    return this.http.get<ClientNewsListResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ClientNews> {
    return this.http.get<ClientNews>(`${this.apiUrl}/${id}`);
  }

  update(id: number, news: Partial<ClientNewsRequest>): Observable<ClientNews> {
    return this.http.put<ClientNews>(`${this.apiUrl}/${id}`, news);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deleteMany(ids: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-many`, { ids });
  }
}
