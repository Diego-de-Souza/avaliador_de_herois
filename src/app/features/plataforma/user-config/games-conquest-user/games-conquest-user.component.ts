import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-games-conquest-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games-conquest-user.component.html',
  styleUrl: './games-conquest-user.component.css'
})
export class GamesConquestUserComponent {
  conquistas = [
    { nome: 'Primeira Vitória', descricao: 'Ganhou seu primeiro jogo.' },
    { nome: 'Mestre dos Quizzes', descricao: 'Acertou 100 quizzes.' }
  ];

  stats = {
    jogos: 42,
    vitorias: 28,
    derrotas: 14,
    pontos: 1230
  };

  ranking = [
    { posicao: 1, nome: 'OgeidHavox', pontos: 1230 },
    { posicao: 2, nome: 'HeroMaster', pontos: 1100 },
    { posicao: 3, nome: 'QuizKing', pontos: 950 }
  ];
}
