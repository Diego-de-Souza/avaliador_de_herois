import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class TeamHttpService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiURL;

    getAllTeams(): Observable<any>{
        return this.http.get<any>(`${this.apiUrl}/team/find-all-team`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
    }

    getOneTeam(id: string | null): Observable<any>{
        return this.http.get<any>(`${this.apiUrl}/team/find-one-team/${id}`,{
          headers: {
            'Content-Type': 'application/json'
          }
        });
    }

    deleteOneTeam(id: number | null): Observable<any>{
        return this.http.delete(`${this.apiUrl}/team/delete-one-team/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
    }

    putUpdateTeam(teamId: string | null, teamData: any): Observable<any>{
        const data = {data: teamData};
        return this.http.put<any>(`${this.apiUrl}/team/update/${teamId}`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    }

    postRegisterTeam(teamData: any): Observable<any>{
        const data = {data: teamData};
        return this.http.post<ArrayBuffer>(`${this.apiUrl}/team`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    }
}