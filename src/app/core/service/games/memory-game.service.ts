import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MemoryGameService {
    
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiURL;

    getDataMemoryGame(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/games/memory-game`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}