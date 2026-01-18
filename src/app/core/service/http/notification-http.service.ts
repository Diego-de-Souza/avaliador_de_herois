import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Notification, NotificationApiResponse, NotificationRequest } from '../../../core/interface/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiURL}/notifications`;

  getAll(userId: number): Observable<NotificationApiResponse> {
    return this.http.get<NotificationApiResponse>(`${this.apiUrl}?usuario_id=${userId}`);
  }

  getById(id: number): Observable<NotificationApiResponse> {
    return this.http.get<NotificationApiResponse>(`${this.apiUrl}/${id}`);
  }

  markAsRead(id: number): Observable<NotificationApiResponse> {
    return this.http.patch<NotificationApiResponse>(`${this.apiUrl}/${id}/read`, {});
  }

  delete(id: number): Observable<NotificationApiResponse> {
    return this.http.delete<NotificationApiResponse>(`${this.apiUrl}/${id}`);
  }

  create(notification: NotificationRequest): Observable<NotificationApiResponse> {
    return this.http.post<NotificationApiResponse>(this.apiUrl, notification);
  }
}
