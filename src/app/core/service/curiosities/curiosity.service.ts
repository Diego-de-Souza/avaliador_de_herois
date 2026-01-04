import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuriosityService {

  private readonly http = inject(HttpClient);

  getCuriositiesList(): Observable<any> {
    return this.http.get('${environment.apiURL}/curiosities/find-all-curiosities');
  }
}
