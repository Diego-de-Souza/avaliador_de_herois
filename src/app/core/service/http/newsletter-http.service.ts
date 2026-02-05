import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  NewsletterNewsItem,
  NewsletterItemRequest,
  NewsletterListResponse,
  ClientNews,
  ClientNewsRequest,
  ClientNewsListResponse
} from '../../interface/client-news.interface';
import { ApiResponse } from '../../interface/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class NewsletterHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiURL}/newsletter`;

  getList(): Observable<ApiResponse<NewsletterNewsItem>> {
    return this.http.get<ApiResponse<NewsletterNewsItem>>(this.apiUrl);
  }

  getById(id: string): Observable<ApiResponse<NewsletterNewsItem>> {
    return this.http.get<ApiResponse<NewsletterNewsItem>>(`${this.apiUrl}/${id}`);
  }

  create(item: NewsletterItemRequest): Observable<ApiResponse<NewsletterNewsItem>> {
    return this.http.post<ApiResponse<NewsletterNewsItem>>(`${this.apiUrl}`, item);
  }

  update(id: string, item: Partial<NewsletterItemRequest>): Observable<ApiResponse<NewsletterNewsItem>> {
    return this.http.put<ApiResponse<NewsletterNewsItem>>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.apiUrl}/${id}`);
  }

  //clients newsletter
  createClientNewsletter(news: ClientNewsRequest): Observable<ApiResponse<ClientNews>> {
    return this.http.post<ApiResponse<ClientNews>>(`${this.apiUrl}/client`, news);
  }

  getAllClientNewsletters(userId: string): Observable<ApiResponse<ClientNewsListResponse>> {
    const params = new HttpParams().set('usuario_id', userId.toString());
    return this.http.get<ApiResponse<ClientNewsListResponse>>(`${this.apiUrl}/client/find-all-newsletters`, { params });
  }

  getClientNewsletterById(id: string): Observable<ApiResponse<ClientNews>> {
    return this.http.get<ApiResponse<ClientNews>>(`${this.apiUrl}/client/${id}`);
  }

  updateClientNewsletter(id: string, news: Partial<ClientNewsRequest>): Observable<ApiResponse<ClientNews>> {
    return this.http.put<ApiResponse<ClientNews>>(`${this.apiUrl}/client/${id}`, news);
  }

  deleteClientNewsletter(id: string): Observable<ApiResponse<ClientNews>> {
    return this.http.delete<ApiResponse<ClientNews>>(`${this.apiUrl}/client/${id}`);
  } 

  deleteManyClientNewsletters(ids: string[]): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.apiUrl}/client/delete-many`, { ids });
  }

  getListNewsletters(): Observable<ApiResponse<NewsletterNewsItem>> {
    const response = this.http.get<ApiResponse<NewsletterNewsItem>>(`${this.apiUrl}/newsletter-list`);
    console.log('response no http',response);
    return response;
  }
}
