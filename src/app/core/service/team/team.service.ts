import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiURL;

  getAllTeams(): Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/team/find-all-team`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }
}
