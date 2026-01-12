import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GamesHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiURL;

  // Criar novo jogo
  createGame(gameData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/games`, gameData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Atualizar jogo existente
  updateGame(gameId: number, gameData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/games/${gameId}`, gameData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Buscar jogo por ID
  getGameById(gameId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/games/${gameId}`);
  }

  // Listar todos os jogos
  getAllGames(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/games/list-games`);
  }

  // Deletar jogo
  deleteGame(gameId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/games/${gameId}`);
  }
}
