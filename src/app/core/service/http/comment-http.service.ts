import { HttpClient } from '@angular/common/http';
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
    const params: any = {};
    if (filters.articleId) params.articleId = filters.articleId.toString();
    if (filters.userId) params.userId = filters.userId.toString();
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.limit) params.limit = filters.limit.toString();
    if (filters.offset) params.offset = filters.offset.toString();

    return this.http.get<any>(`${this.apiUrl}/comments`, { params });
  }

  /**
   * Buscar comentário por ID
   */
  getCommentById(commentId: number): Observable<any> {
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
  updateComment(commentId: number, comment: CommentUpdate): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/comments/${commentId}`, comment);
  }

  /**
   * Deletar comentário (soft delete)
   */
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/comments/${commentId}`);
  }

  /**
   * Dar like em comentário
   */
  likeComment(commentId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comments/${commentId}/like`, {});
  }

  /**
   * Remover like de comentário
   */
  unlikeComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/comments/${commentId}/like`);
  }

  /**
   * Dar dislike em comentário
   */
  dislikeComment(commentId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comments/${commentId}/dislike`, {});
  }

  /**
   * Remover dislike de comentário
   */
  undislikeComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/comments/${commentId}/dislike`);
  }
}
