import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { HeroBattleService } from '../../../../core/service/games/hero-battle.service';
import { GameState, PlayerClass, Habilidade } from '../../../../core/interface/battle-heroes.interface';
import { CLASSES_JOGADOR } from '../../../../data/battle-heroes';
import { GameHelpModalComponent } from '../../../../shared/components/explanation_game/game-help-modal.component';
import { ProgressService } from '../../../../core/service/games/progress.service';
import { AuthService } from '../../../../core/service/auth/auth.service';

@Component({
  selector: 'app-hero-battle',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, GameHelpModalComponent],
  templateUrl: './hero-battle.html',
  styleUrl: './hero-battle.css'
})
export class HeroBattle implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly gameService = inject(HeroBattleService);
  private readonly gameProgress = inject(ProgressService);
  private readonly authService = inject(AuthService);

  public _themeService = 'dark';
  public gameState: GameState | null = null;
  public classesDisponiveis = CLASSES_JOGADOR;
  public showHelpModal = false;

  public progressSaving = false;
  public progressMessage = '';
  private autoSaveTriggered = false;
  public gameStats = {
    score: 0,
    attempts: 1,
    startTime: Date.now()
  };

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this._themeService = theme;
    });

    this.gameService.gameState$.subscribe(state => {
      this.gameState = state;
      
      // Verificar auto-save apenas quando a fase mudar para 'vitoria'
      if (state.fase === 'vitoria' && !this.autoSaveTriggered) {
        this.autoSaveTriggered = true;
        setTimeout(() => this.checkAutoSave(), 100);
      } else if (state.fase !== 'vitoria') {
        // Resetar flag quando sair da fase de vitória
        this.autoSaveTriggered = false;
      }
    });

    this.loadSavedProgress();
  }

  selecionarClasse(classe: PlayerClass) {
    this.gameService.selecionarClasse(classe.id);
    this.gameStats.startTime = Date.now();
  }

  atacar() {
    this.gameService.atacar();
  }

  usarHabilidade(habilidade: Habilidade) {
    this.gameService.usarHabilidade(habilidade);
  }

  proximoNivel() {
    this.saveProgress();
    this.gameService.proximoNivel();
  }

  reiniciarJogo() {
    this.gameStats.attempts++;
    this.gameStats.startTime = Date.now();
    this.gameStats.score = 0;
    this.gameService.reiniciarJogo();
  }

  openHelp() {
    this.showHelpModal = true;
  }

  closeHelp() {
    this.showHelpModal = false;
  }

  getTempoJogado(): string {
    const tempoMs = Date.now() - this.gameStats.startTime;
    const segundos = Math.floor(tempoMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);

    if (horas > 0) {
      return `${horas}h ${minutos % 60}m ${segundos % 60}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${segundos % 60}s`;
    } else {
      return `${segundos}s`;
    }
  }

  saveProgress() {
    if (!this.gameState?.jogador) return;

    const user = this.authService.getUser();
    this.progressSaving = true;
    const tempoJogado = Math.floor((Date.now() - this.gameStats.startTime) / 1000);
    
    // Calcular score baseado na performance
    const scoreBase = this.gameState.nivel * 100;
    const bonusVida = Math.floor((this.gameState.jogador.stats.vida / this.gameState.jogador.stats.vidaMax) * 50);
    const bonusNivel = this.gameState.jogador.stats.nivel * 25;
    this.gameStats.score = scoreBase + bonusVida + bonusNivel;

    const metadata = {
        classe_escolhida: this.gameState.jogador.classe.nome,
        tempo_jogado: tempoJogado,
        nivel_personagem: this.gameState.jogador.stats.nivel,
        experiencia_total: this.gameState.jogador.stats.experiencia,
        vida_atual: this.gameState.jogador.stats.vida,
        vida_maxima: this.gameState.jogador.stats.vidaMax,
        ultima_fase: this.gameState.fase,
        inimigo_atual: this.gameState.inimigo?.nome || 'Nenhum'
    };

    this.gameProgress.saveProgressHeroBattle(
      user.id,
      2,
      this.gameState.nivel,
      this.gameStats.score,
      this.gameStats.attempts,
      metadata
    ).subscribe({
      next: (response) => {
        this.progressSaving = false;
        this.progressMessage = '💾 Progresso salvo com sucesso!'
        if (this.gameState) {
          this.gameState.log = [
            ...this.gameState.log,
            `💾 Progresso salvo! Score: ${this.gameStats.score} pontos`
          ];
        }

        // Limpar mensagem após 3 segundos
        setTimeout(() => {
          this.progressMessage = '';
        }, 3000);  
      },
      error: (error) => {
        console.error('Erro ao salvar progresso:', error);
        this.progressSaving = false;
        this.progressMessage = '❌ Erro ao salvar progresso.';
      }
    });
  }

  private loadSavedProgress() {
    try {
      const saved = localStorage.getItem('hero-battle-progress');
      if (saved) {
        const progress = JSON.parse(saved);
        this.gameStats.score = progress.score || 0;
        this.gameStats.attempts = progress.attempts || 1;
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  }

  checkAutoSave() {
    if (this.gameState?.fase === 'vitoria' && !this.progressSaving) {
      this.saveProgress();
    }
  }

  getBarraVidaPercent(vida: number, vidaMax: number): number {
    return (vida / vidaMax) * 100;
  }

  getBarraManaPercent(mana: number, manaMax: number): number {
    return (mana / manaMax) * 100;
  }

  getHabilidadesDisponiveis(): Habilidade[] {
    if (!this.gameState) return [];
    return this.gameState.jogador.classe.habilidades.filter(h => 
      !h.isUltimate || this.gameState!.jogador.stats.nivel >= 5
    );
  }

  podeUsarHabilidade(habilidade: Habilidade): boolean {
    if (!this.gameState) return false;
    return this.gameState.jogador.stats.mana >= habilidade.custo;
  }

  // MÉTODOS AUXILIARES PARA EVITAR ERROS DE NULL
  get jogador() {
    return this.gameState?.jogador;
  }

  get inimigo() {
    return this.gameState?.inimigo;
  }

  get nivel() {
    return this.gameState?.nivel || 0;
  }

  get turno() {
    return this.gameState?.turno || 'jogador';
  }

  get fase() {
    return this.gameState?.fase || 'selecao-classe';
  }

  get log() {
    return this.gameState?.log || [];
  }
}