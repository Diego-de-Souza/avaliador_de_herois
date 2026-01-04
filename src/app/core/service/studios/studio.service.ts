import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudioService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiURL;

  getAllStudios(): Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/studio/find-all-studio`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }
}
