import { inject, Injectable } from "@angular/core";
import { NewsletterHttpService } from "../http/newsletter-http.service";
import { map, catchError, Observable, of } from "rxjs";
import { ClientNews, ClientNewsListResponse, ClientNewsRequest, NewsletterItemRequest, NewsletterNewsItem } from "../../interface/client-news.interface";
import { NewsletterListResponse } from "../../interface/client-news.interface";
import { AuthService } from "../auth/auth.service";
import { ApiResponse } from "../../interface/api-response.interface";

@Injectable({
  providedIn: 'root'
    })
export class NewsService {
  private readonly newsletterHttpService = inject(NewsletterHttpService);
  private readonly authService = inject(AuthService);

  getList(): Observable<NewsletterNewsItem[]> {
    return this.newsletterHttpService.getList().pipe(
      map((response: ApiResponse<NewsletterNewsItem>) => response.data ?? []),
      catchError(error => {
        console.error('Erro na service:', error);
        return of([]);
      })
    );
  }

  getById(id: string): Observable<ApiResponse<NewsletterNewsItem>> {
    return this.newsletterHttpService.getById(id);
  }

  create(item: NewsletterItemRequest): Observable<ApiResponse<NewsletterNewsItem>> {
    const userId = this.authService.getUserId() ?? '';
    let data ={
      ...item,
      usuario_id: userId
    }
    return this.newsletterHttpService.create(data);
  }

  update(id: string, item: Partial<NewsletterItemRequest>): Observable<ApiResponse<NewsletterNewsItem>> {
    return this.newsletterHttpService.update(id, item);
  }

  delete(id: string): Observable<ApiResponse<unknown>> {
    return this.newsletterHttpService.delete(id);
  }

  createClientNewsletter(news: ClientNewsRequest): Observable<ApiResponse<ClientNews>> {
    return this.newsletterHttpService.createClientNewsletter(news);
  }

  getAllClientNewsletters(userId: string): Observable<ApiResponse<ClientNewsListResponse>> {
    return this.newsletterHttpService.getAllClientNewsletters(userId);
  }

  getClientNewsletterById(id: string): Observable<ApiResponse<ClientNews>> {
    return this.newsletterHttpService.getClientNewsletterById(id);
  }

  updateClientNewsletter(id: string, news: Partial<ClientNewsRequest>): Observable<ApiResponse<ClientNews>> {
    return this.newsletterHttpService.updateClientNewsletter(id, news);
  }

  deleteClientNewsletter(id: string): Observable<ApiResponse<ClientNews>> {
    return this.newsletterHttpService.deleteClientNewsletter(id);
  } 

  deleteManyClientNewsletters(ids: string[]): Observable<ApiResponse<unknown>> {
    return this.newsletterHttpService.deleteManyClientNewsletters(ids);
  }

  getListNewsletters(): Observable<ApiResponse<NewsletterNewsItem>> {
    const response = this.newsletterHttpService.getListNewsletters();
    console.log('response no service',response);
    return response;
  }
}