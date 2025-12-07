import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
    private readonly http = inject(HttpClient);
    
    saveEvent(eventData: FormData): Observable<any> {
        return this.http.post<any>(`${environment.apiURL}/events`, eventData);
    }

    getEventsList(): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/events`);
    }   

    deleteEvent(event_id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiURL}/events/delete/${event_id}`);
    } 
    
    getEventos(): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/events/list-home`);
    }
}