import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-user.component.html',
  styleUrl: './quiz-user.component.css'
})
export class QuizUserComponent implements OnInit {
  quizzes: any[] = [];
  badges: any[] = [];
  pontuacaoTotal: number = 0;
  loading = true;
  hasData = false;

  ngOnInit(): void {
      this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      // Simule chamada ao backend
      await this.getDataBackend();
      
      // Verificar se há pelo menos algum dado
      this.hasData = this.quizzes.length > 0 || this.badges.length > 0;
      this.loading = false;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      this.loading = false;
    }
  }

  private async getDataBackend() {
    // Simular delay do backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular dados vazios/nulos do backend (comentar as linhas abaixo para testar dados vazios)
    // this.quizzes = [
    //   { id: 1, titulo: 'Quiz de Heróis', data: '2025-08-01', pontos: 80, resultado: 'Aprovado' },
    //   { id: 2, titulo: 'Quiz de Vilões', data: '2025-07-20', pontos: 45, resultado: 'Reprovado' }
    // ];
    
    // this.badges = [
    //   { nome: 'Herói do Conhecimento' },
    //   { nome: 'Quiz Master' }
    // ];

    // this.pontuacaoTotal = 125;

    // Para testar sem dados, descomente as linhas abaixo:
    this.quizzes = [];
    this.badges = [];
    this.pontuacaoTotal = 0;
    // this.metodosPagamento = [];
  }

  resetarProgresso() {
    // Implemente a lógica de resetar progresso
    this.quizzes = [];
    this.pontuacaoTotal = 0;
    this.badges = [];
  }
}
