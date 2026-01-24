import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { HeroPlatformService, HeroGame } from './hero-platform.service';
import { AuthService } from '../../../../core/service/auth/auth.service';
import { ProgressService } from '../../../../core/service/games/progress.service';

@Component({
  selector: 'app-hero-platform',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './hero-platform.component.html',
  styleUrl: './hero-platform.component.css'
})
export class HeroPlatformComponent implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly heroPlatformService = inject(HeroPlatformService);
  private readonly authService = inject(AuthService);
  private readonly progressService = inject(ProgressService);
  private readonly router = inject(Router);

  public theme = signal('dark');
  public showMenu = signal(true);
  public showChooseGameMode = signal(false);
  public showUI = signal(false);
  public showEnergyMeter = signal(false);
  public showInstructions = signal(false);
  public showHowToPlay = signal(false);
  public showHighScores = signal(false);
  public showGameOver = signal(false);
  public showVictory = signal(false);
  public showLevelComplete = signal(false);

  public score = signal(0);
  public level = signal(1);
  public lives = signal(3);
  public energy = signal(100);

  public gameOverMessage = signal('');
  public victoryMessage = signal('');
  public levelCompleteMessage = signal('');
  public loadingMessage = signal('');

  private gameInstance: HeroGame | null = null;
  private savedProgress: any = null;
  private readonly GAME_ID = 6; 

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.theme.set(theme);
    });

    // Buscar progresso salvo da API
    this.loadProgressFromAPI();
  }

  ngOnDestroy() {
    this.heroPlatformService.destroyGame();
  }

  private loadProgressFromAPI(): void {
    const user = this.authService.getUser();
    if (!user) {
      // Se não está logado, iniciar novo jogo
      this.initializeNewGame();
      return;
    }

    this.loadingMessage.set('Carregando progresso...');
    this.progressService.getUserGameProgress(user.id, this.GAME_ID).subscribe({
      next: (response) => {
        if (response && response.dataUnit) {
          this.savedProgress = response.dataUnit;
          // Mostrar opção de continuar ou recomeçar
          this.showChooseGameMode.set(true);
          this.showMenu.set(false);
        } else {
          this.initializeNewGame();
        }
        this.loadingMessage.set('');
      },
      error: (error) => {
        console.error('Erro ao carregar progresso:', error);
        this.initializeNewGame();
        this.loadingMessage.set('');
      }
    });
  }

  private initializeNewGame(): void {
    this.savedProgress = null;
    this.showMenu.set(true);
    this.showChooseGameMode.set(false);
  }

  continueGame(): void {
    if (!this.savedProgress) {
      this.startNewGame();
      return;
    }

    const progress = this.savedProgress;
    this.level.set(progress.lvl_user || 1);
    this.score.set(progress.score || 0);

    setTimeout(() => {
      this.gameInstance = this.heroPlatformService.initGame('gameContainer');
      this.setupGameCallbacks();
      this.startGame();
    }, 100);
  }

  startNewGame(): void {
    this.score.set(0);
    this.level.set(1);
    this.lives.set(3);
    this.energy.set(100);
    this.savedProgress = null;

    setTimeout(() => {
      this.gameInstance = this.heroPlatformService.initGame('gameContainer');
      this.setupGameCallbacks();
      this.startGame();
    }, 100);
  }

  private setupGameCallbacks(): void {
    if (!this.gameInstance) return;

    this.gameInstance.setCallbacks({
      onScoreUpdate: (score: number) => {
        this.score.set(score);
      },
      onLevelUpdate: (level: number) => {
        this.level.set(level);
      },
      onLivesUpdate: (lives: number) => {
        this.lives.set(lives);
      },
      onEnergyUpdate: (energy: number) => {
        this.energy.set(energy);
      },
      onGameOver: () => {
        this.handleGameOver();
      },
      onLevelComplete: () => {
        this.handleLevelComplete();
      },
      onGameWin: () => {
        this.handleVictory();
      },
      onGameReady: () => {
        console.log('🎮 Jogo pronto! Iniciando...');
        this.gameInstance?.startGame();
      }
    });
  }

  startGame(): void {
    this.showMenu.set(false);
    this.showUI.set(true);
    this.showEnergyMeter.set(true);
    this.showInstructions.set(true);
    this.showHowToPlay.set(false);
    this.showHighScores.set(false);
    this.showGameOver.set(false);
    this.showVictory.set(false);
    this.showLevelComplete.set(false);

    // NÃO chamar startGame() aqui - será chamado pelo callback onGameReady
    // isso garante que create() foi concluído
  }

  showHowToPlayMenu(): void {
    this.showHowToPlay.set(true);
    this.showHighScores.set(false);
  }

  showHighScoresMenu(): void {
    this.showHighScores.set(true);
    this.showHowToPlay.set(false);
  }

  backToMainMenu(): void {
    this.showHowToPlay.set(false);
    this.showHighScores.set(false);
  }

  retryLevel(): void {
    this.showGameOver.set(false);
    this.showUI.set(true);
    this.showEnergyMeter.set(true);
    this.showInstructions.set(true);

    if (this.gameInstance) {
      this.gameInstance.retryLevel();
    }
  }

  playAgain(): void {
    // Reset game state
    this.score.set(0);
    this.level.set(1);
    this.lives.set(3);
    this.energy.set(100);
    this.showVictory.set(false);
    this.showGameOver.set(false);
    this.showMenu.set(true);
    this.showUI.set(false);
    this.showEnergyMeter.set(false);
    this.showInstructions.set(false);

    // Reload game
    this.heroPlatformService.destroyGame();
    setTimeout(() => {
      this.gameInstance = this.heroPlatformService.initGame('gameContainer');
      this.setupGameCallbacks();
    }, 100);
  }

  private handleGameOver(): void {
    this.showUI.set(false);
    this.showEnergyMeter.set(false);
    this.showInstructions.set(false);
    
    if (this.lives() > 0) {
      this.gameOverMessage.set(`Você tem ${this.lives()} ${this.lives() === 1 ? 'vida' : 'vidas'} restantes!`);
      this.showGameOver.set(true);
    } else {
      this.gameOverMessage.set(`Pontuação Final: ${this.score()}\nVocê chegou ao Nível ${this.level()}!`);
      this.showGameOver.set(true);
    }
  }

  private handleLevelComplete(): void {
    this.showLevelComplete.set(true);
    this.levelCompleteMessage.set(`Nível ${this.level()} Completo!\nBônus de Energia: +${Math.floor(this.energy() * 100)}\nPontuação Total: ${this.score()}`);
    
    // Salvar progresso na API
    this.saveProgressToAPI();
    
    setTimeout(() => {
      this.showLevelComplete.set(false);
    }, 3000);
  }

  private handleVictory(): void {
    this.showUI.set(false);
    this.showEnergyMeter.set(false);
    this.showInstructions.set(false);
    this.victoryMessage.set(`Parabéns! Você salvou a cidade!\nPontuação Final: ${this.score()}\nEnergia Final: ${Math.floor(this.energy())}%\nVidas Restantes: ${this.lives()}`);
    this.showVictory.set(true);
  }

  getHighScores(): Array<{ score: number; level: number; lives: number; date: string }> {
    if (!this.gameInstance) return [];
    return this.gameInstance.getHighScores();
  }

  formatMessage(message: string): string {
    return message.replace(/\n/g, '<br>');
  }

  backToGameSelection(): void {
    this.heroPlatformService.destroyGame();
    this.router.navigate(['/webmain/games']);
  }

  private saveProgressToAPI(): void {
    const user = this.authService.getUser();
    if (!user) return;

    const metadata = {
      energy: this.energy(),
      lives: this.lives(),
      completed_levels: this.level() - 1
    };

    this.progressService.saveProgressHeroBattle(
      user.id,
      this.GAME_ID,
      this.level(),
      this.score(),
      0,
      metadata
    ).subscribe({
      next: (response) => {
        console.log('✅ Progresso salvo com sucesso!', response);
      },
      error: (error) => {
        console.error('❌ Erro ao salvar progresso:', error);
      }
    });
  }
}
