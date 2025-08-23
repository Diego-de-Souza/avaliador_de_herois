import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-user.component.html',
  styleUrl: './quiz-user.component.css'
})
export class QuizUserComponent {
  quizzes = [
    { id: 1, titulo: 'Quiz de Heróis', data: '2025-08-01', pontos: 80, resultado: 'Aprovado' },
    { id: 2, titulo: 'Quiz de Vilões', data: '2025-07-20', pontos: 45, resultado: 'Reprovado' }
  ];

  pontuacaoTotal = 125;

  badges = [
    { nome: 'Herói do Conhecimento' },
    { nome: 'Quiz Master' }
  ];

  resetarProgresso() {
    // Implemente a lógica de resetar progresso
    this.quizzes = [];
    this.pontuacaoTotal = 0;
    this.badges = [];
  }
}
