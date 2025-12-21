import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { Router } from '@angular/router';
import { MemoryGameService } from '../../../../core/service/games/memory-game.service';
import { FormsModule } from '@angular/forms';
import { MemoryCard } from '../../../../core/interface/game-memory.interface';
import { AuthService } from '../../../../core/service/auth/auth.service';
import { ProgressService } from '../../../../core/service/games/progress.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalSucessoCadastroComponent],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.css'
})
export class MemoryGameComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly memoryGameService = inject(MemoryGameService);
  private readonly progressService = inject(ProgressService);
  private readonly authService = inject(AuthService);

  _themeMemoryGame = 'dark';
  cards: MemoryCard[] = [];
  flippedCards: MemoryCard[] = [];
  lockBoard = false;
  showModal = false;
  modalTitle: string = '';
  modalMessage: string = '';
  moves = 0;

  themes: string[] = [];
  selectedTheme: string = '';
  levels: number[] = [1, 2, 3, 4, 5];
  selectedLevel: number = 1;
  private gameCompleted = false;

  userProgress: any = null;
  userId: number | null = null;
  gameId: number = 1; 

  message: string | null = null;

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this._themeMemoryGame = theme;
    });

    this.memoryGameService.getThemes().subscribe(themes => {
      this.themes = themes;
      this.selectedTheme = themes[0] || '';
      this.loadProgressAndStart();
    });
  }

  loadProgressAndStart() {
    console.log(this.authService.isLoggedIn())
    if (this.authService.isLoggedIn()) {
      this.userId = this.authService.getUserId();
      if (this.userId !== null) {
        this.progressService.getUserGameProgress(this.userId, this.gameId).subscribe(progress => {
          console.log('Progresso recebido:', progress);

          if (progress && progress.dataUnit && progress.dataUnit.metadata) {
            console.log('dados iguais?:', progress.dataUnit.metadata.theme == this.selectedTheme);
            this.userProgress = progress;
            this.selectedTheme = progress.metadata?.theme || this.selectedTheme;
            if (progress.dataUnit.metadata.theme == this.selectedTheme) {
              this.selectedLevel = progress.dataUnit.lvl_user + 1 || this.selectedLevel;
            }
          }
          this.startGame();
        });
      }
     
    } else {
      this.startGame();
    }
  }

  startGame() {
    this.moves = 0;
    this.showModal = false;
    this.lockBoard = false;
    this.flippedCards = [];
    this.memoryGameService.getCards(this.selectedLevel, this.selectedTheme).subscribe(cards => {
      let prepared = cards.map((card, idx) => ({
        ...card,
        id: idx,
        flipped: false,
        matched: false,
        uuid: idx + '-' + Math.random().toString(36).substring(2, 8)
      }));
      this.cards = this.shuffle([...prepared, ...prepared].map((c, i) => ({ ...c, uuid: i + '-' + c.id })));
    });
  }

  shuffle(array: MemoryCard[]): MemoryCard[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  flipCard(card: MemoryCard) {
    if (this.lockBoard || card.flipped || card.matched) return;
    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.lockBoard = true;
      setTimeout(() => this.checkForMatch(), 700);
    }
  }

  checkForMatch() {
    const [first, second] = this.flippedCards;
    if (first.id === second.id && first.uuid !== second.uuid) {
      first.matched = second.matched = true;
    } else {
      first.flipped = second.flipped = false;
    }
    this.flippedCards = [];
    this.lockBoard = false;
    
    // ✅ VERIFICAR SE COMPLETOU O JOGO
    if (this.cards.every(card => card.matched)) {
      this.gameCompleted = true; 
      this.modalTitle = 'Parabéns!';
      this.modalMessage = `Você completou o nível ${this.selectedLevel} em ${this.moves} movimentos!`;
      this.showModal = true;
      
      // ✅ SALVAR PROGRESSO APENAS SE ESTIVER LOGADO
      this.saveProgress();
    }
  }

  saveProgress() {
    if (this.authService.isLoggedIn() && this.userId) {
      this.progressService.saveProgress(
        this.userId,
        this.gameId,
        this.selectedLevel,
        this.selectedTheme,
        this.moves,
        this.cards.length / 2
      ).subscribe({
        next: (response) => {
          if (response?.status === 200) {
            this.updateUserProgress(response);

          } else {
            this.modalTitle = 'Game da memoria';
            this.modalMessage = 'Erro ao salvar progresso!';
            this.showModal = true;
          }
        },
        error: () => {
          this.modalTitle = 'Game da memoria';
          this.modalMessage = 'Erro ao salvar progresso!';
          this.showModal = true;
        }
      });
    }
  }

  nextLevel() {
    this.gameCompleted = false;
    this.selectedLevel++;
    this.showModal = false;
    this.startGame();
  }

  restart() {
    this.gameCompleted = false; // ✅ RESETAR FLAG ao reiniciar
    this.showModal = false;
    this.startGame();
  }

  returnMenu() {
    this.router.navigate(['/webmain']);
  }

  onThemeChange(theme: string) {
    this.selectedTheme = theme;
    this.gameCompleted = false; // ✅ RESETAR FLAG ao mudar tema
    
    if (this.userProgress && this.userProgress.dataUnit.metadata.theme === theme) {
      this.selectedLevel = this.userProgress.dataUnit.lvl_user + 1;
    } else {
      this.selectedLevel = 1;
    }
    
    this.startGame();
  }

  onLevelChange(level: number) {
    this.selectedLevel = level;
    this.gameCompleted = false; // ✅ RESETAR FLAG ao mudar nível
    this.startGame();
  }

  closeModal() {
    this.showModal = false;
    
    if (this.gameCompleted) {
      this.gameCompleted = false; // ✅ RESETAR A FLAG
      this.selectedLevel++; // ✅ AVANÇAR PARA O PRÓXIMO NÍVEL
      this.startGame(); // ✅ INICIAR O NOVO JOGO
      
      // ✅ SALVAR O PROGRESSO DO NOVO NÍVEL (opcional)
      if (this.authService.isLoggedIn() && this.userId) {
        this.progressService.saveProgress(
          this.userId,
          this.gameId,
          this.selectedLevel,
          this.selectedTheme,
          0, // moves zerados
          this.cards.length / 2
        ).subscribe({
          next: (response) => {
            if (response?.status === 200) {
              this.updateUserProgress(response);
              console.log('✅ Progresso do novo nível salvo!');
            }
          },
          error: (error) => {
            console.error('❌ Erro ao salvar progresso do novo nível:', error);
          }
        });
      }
    }
  }

  private updateUserProgress(response: any) {
    this.userProgress = response;
    console.log('📊 Progresso atualizado:', this.userProgress);
    
    // ✅ NÃO atualizar selectedLevel aqui, pois já é feito no closeModal()
  }
}