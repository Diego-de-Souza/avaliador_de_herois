import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { articlesProps } from "../../interface/articles.interface";
import { ClientArticle, ClientArticleListResponse, ClientArticleRequest } from "../../interface/client-article.interface";


@Injectable({
    providedIn: 'root'
})
export class ArticleHttpService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiURL}/articles`;

    getArticleById(id: string): Observable<String[]> {
        return this.http.get<String[]>(`${this.apiUrl}/find-one-article/${id}`);
    }

    createArticle(article: articlesProps): Observable<articlesProps> {
        return this.http.post<articlesProps>(`${this.apiUrl}`, article);
    }

    updateArticle(id: string, article: articlesProps): Observable<articlesProps> {
        return this.http.put<articlesProps>(`${this.apiUrl}/update/${id}`, article);
    }

    deleteArticle(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete-one-article/${id}`);
    }

    getArticlesList(): Observable<any> {
        return this.http.get(`${this.apiUrl}/find-all-articles`);
    }

    getArticlesHomepage(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/articles-for-homepage`);
    }

    //clients articles
    createClientArticle(article: ClientArticleRequest): Observable<ClientArticle> {
        return this.http.post<ClientArticle>(`${this.apiUrl}/client`, article);
    }

    getAllClientArticles(userId: string): Observable<ClientArticleListResponse> {
        const params = new HttpParams().set('usuario_id', userId.toString());
        return this.http.get<ClientArticleListResponse>(`${this.apiUrl}/client/find-all-articles`, { params });
    }

    getClientArticleById(id: string): Observable<ClientArticle> {
        return this.http.get<ClientArticle>(`${this.apiUrl}/client/${id}`);
    }

    updateClientArticle(id: string, article: Partial<ClientArticleRequest>): Observable<ClientArticle> {
        return this.http.put<ClientArticle>(`${this.apiUrl}/client/${id}`, article);
    }

    deleteClientArticle(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/client/${id}`);
    }

    deleteManyClientArticles(ids: string[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/client/delete-many`, { ids });
    }
}