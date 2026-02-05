import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiURL;

  // Busca o progresso do usuário para um jogo específico
  getUserGameProgress(user_id: string, game_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/games/user-game-progress?user_id=${user_id}&game_id=${game_id}`);
  }

  // Salva ou atualiza o progresso do usuário
  saveProgress(
    user_id: string,
    game_id: string,
    lvl_user: number,
    theme: string,
    score: number,
    attempts: number
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/games/user-game-progress`, {
      user_id: user_id,
      game_id: game_id,
      lvl_user,
      score,
      attempts,
      metadata: { theme }
    });
  }

  saveProgressHeroBattle(
    user_id: string,
    game_id: string | null,
    lvl_user: number,
    score: number,
    attempts: number,
    metadata: any = {}
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/games/user-game-progress`, {
      user_id: user_id,
      game_id: game_id,
      lvl_user,
      score,
      attempts,
      metadata: metadata
    });
  }
}