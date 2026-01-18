import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SACContact, SACApiResponse, SACContactRequest, SACFilters } from '../../../core/interface/sac.interface';

@Injectable({
  providedIn: 'root'
})
export class SACHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiURL}/sac/contacts`;

  getAll(filters?: SACFilters): Observable<SACApiResponse> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.usuario_id) params = params.set('usuario_id', filters.usuario_id.toString());
      if (filters.type) params = params.set('type', filters.type);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.date_from) params = params.set('date_from', filters.date_from);
      if (filters.date_to) params = params.set('date_to', filters.date_to);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<SACApiResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<SACApiResponse> {
    return this.http.get<SACApiResponse>(`${this.apiUrl}/${id}`);
  }

  create(contact: SACContactRequest): Observable<SACApiResponse> {
    const formData = new FormData();
    formData.append('usuario_id', contact.usuario_id.toString());
    formData.append('type', contact.type);
    formData.append('subject', contact.subject);
    formData.append('message', contact.message);
    if (contact.priority) {
      formData.append('priority', contact.priority);
    }
    
    if (contact.attachments && contact.attachments.length > 0) {
      contact.attachments.forEach((file, index) => {
        formData.append(`attachments`, file, file.name);
      });
    }

    return this.http.post<SACApiResponse>(this.apiUrl, formData);
  }

  updateStatus(id: number, status: string): Observable<SACApiResponse> {
    return this.http.patch<SACApiResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  addResponse(id: number, message: string, attachments?: File[]): Observable<SACApiResponse> {
    const formData = new FormData();
    formData.append('message', message);
    
    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append('attachments', file, file.name);
      });
    }

    return this.http.post<SACApiResponse>(`${this.apiUrl}/${id}/responses`, formData);
  }

  delete(id: number): Observable<SACApiResponse> {
    return this.http.delete<SACApiResponse>(`${this.apiUrl}/${id}`);
  }

  downloadAttachment(contactId: number, attachmentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${contactId}/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
  }
}
