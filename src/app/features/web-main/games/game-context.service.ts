import { Injectable, signal } from '@angular/core';

export interface GameContext {
  id: number;
  name: string;
  type: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameContextService {
  private currentGame = signal<GameContext | null>(null);

  setCurrentGame(game: GameContext): void {
    this.currentGame.set(game);
    console.log(`🎮 Jogo selecionado: ${game.name} (ID: ${game.id})`);
  }

  getCurrentGame(): GameContext | null {
    return this.currentGame();
  }

  getCurrentGameId(): number | null {
    return this.currentGame()?.id || null;
  }

  clearCurrentGame(): void {
    this.currentGame.set(null);
  }
}
