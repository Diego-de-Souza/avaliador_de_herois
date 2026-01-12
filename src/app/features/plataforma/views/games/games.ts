import { Component, OnInit } from '@angular/core';
import { GamesHttpService } from '../../../../core/service/http/game-http.service';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [HeaderPlatformComponent, CommonModule],
  templateUrl: './games.html',
  styleUrl: './games.css'
})
export class Games implements OnInit {
  public games: any[] = [];

  constructor(
    private gamesHttpService: GamesHttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gamesHttpService.getAllGames().subscribe({
      next: (response) => {
        // Adaptar conforme a estrutura da resposta da API
        if (response.data) {
          this.games = response.data;
        } else if (Array.isArray(response)) {
          this.games = response;
        } else {
          this.games = [];
        }
      },
      error: (error) => {
        console.error("Erro ao carregar os games", error);
        this.games = [];
      }
    });
  }

  deleteGame(id: number): void {
    if (confirm('Tem certeza que deseja excluir este game?')) {
      this.gamesHttpService.deleteGame(id).subscribe({
        next: () => {
          this.loadGames();
        },
        error: (error) => {
          console.error("Erro ao excluir o game", error);
          alert('Erro ao excluir o game. Tente novamente.');
        }
      });
    }
  }

  editGame(id: number): void {
    this.router.navigate([`/plataforma/cadastro/games/${id}`]);
  }
}
