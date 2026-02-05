import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamHttpService } from '../http/team-http.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private readonly teamHttpService = inject(TeamHttpService);

  getAllTeams(): Observable<any>{
    return this.teamHttpService.getAllTeams();
  }

  getOneTeam(id: string | null): Observable<any>{
    return this.teamHttpService.getOneTeam(id);
  }

  deleteOneTeam(id: number | null): Observable<any>{
    return this.teamHttpService.deleteOneTeam(id);
  }

  putUpdateTeam(teamId: string | null, teamData: any): Observable<any>{
    return this.teamHttpService.putUpdateTeam(teamId, teamData);
  }

  postRegisterTeam(teamData: any): Observable<any>{
    return this.teamHttpService.postRegisterTeam(teamData);
  }

  
}
