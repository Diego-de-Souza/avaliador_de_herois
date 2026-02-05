import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comment, CommentCreate, CommentUpdate, CommentFilters } from '../../interface/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiURL;

  /**
   * Buscar comentários com filtros
   */
  getComments(filters: CommentFilters): Observable<any> {
    let params = new HttpParams();
    if (filters.articleId) params = params.set('articleId', filters.articleId.toString());
    if (filters.userId) params = params.set('userId', filters.userId.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.offset) params = params.set('offset', filters.offset.toString());

    return this.http.get<any>(`${this.apiUrl}/comments`, { params });
  }

  /**
   * Buscar comentário por ID
   */
  getCommentById(commentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/comments/${commentId}`);
  }

  /**
   * Criar novo comentário
   */
  createComment(comment: CommentCreate): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comments`, comment);
  }

  /**
   * Atualizar comentário
   */
  updateComment(commentId: string, comment: CommentUpdate): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/comments/${commentId}`, comment);
  }

  /**
   * Deletar comentário (soft delete)
   */
  deleteComment(commentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/comments/${commentId}`);
  }

  /**
   * Dar like em comentário
   */
  likeComment(commentId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comments/${commentId}/like`, {});
  }

  /**
   * Remover like de comentário
   */
  unlikeComment(commentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/comments/${commentId}/like`);
  }

  /**
   * Dar dislike em comentário
   */
  dislikeComment(commentId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comments/${commentId}/dislike`, {});
  }

  /**
   * Remover dislike de comentário
   */
  undislikeComment(commentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/comments/${commentId}/dislike`);
  }
}
