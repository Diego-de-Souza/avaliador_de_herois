import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-games-conquest-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games-conquest-user.component.html',
  styleUrl: './games-conquest-user.component.css'
})
export class GamesConquestUserComponent implements OnInit{
  conquistas: any[] = [];
  stats: any = {};
  ranking: any[] = [];
  loading = true;
  hasData = false;

  ngOnInit(): void {
      this.loadData();
  }

  async loadData() {
    try {
      // Simular chamada assíncrona (ex: fetch API)
      await this.getDataBackend();
      this.hasData = this.conquistas.length > 0; // Verifica se há conquistas
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

    // Simular dados do backend (comentar as linhas abaixo para testar dados vazios)
    // this.conquistas = [
    //   { nome: 'Primeira Vitória', descricao: 'Ganhou seu primeiro jogo.' },
    //   { nome: 'Mestre dos Quizzes', descricao: 'Acertou 100 quizzes.' }
    // ];

    // this.stats = {
    //   jogos: 42,
    //   vitorias: 28,
    //   derrotas: 14,
    //   pontos: 1230
    // };

    // this.ranking = [
    //   { posicao: 1, nome: 'OgeidHavox', pontos: 1230 },
    //   { posicao: 2, nome: 'HeroMaster', pontos: 1100 },
    //   { posicao: 3, nome: 'QuizKing', pontos: 950 }
    // ];

    // Para testar sem dados, descomente a linha abaixo:
    this.conquistas = [];
    this.stats = {};
    this.ranking = [];
  }
}
