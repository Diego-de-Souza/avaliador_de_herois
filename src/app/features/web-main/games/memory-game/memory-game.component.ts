import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

interface MemoryCard {
  name: string;
  img: string;
  id: number;
  matched?: boolean;
  flipped?: boolean;
}

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.css'
})
export class MemoryGameComponent {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  _themeMemoryGame = 'dark';
  private destroy$ = new Subject<void>();
  
  cards: MemoryCard[] = [];
  flippedCards: MemoryCard[] = [];
  lockBoard = false;
  showModal = false;
  moves = 0;

  readonly cardImages: MemoryCard[] = [
    { name: "angular", img: "https://angular.io/assets/images/logos/angular/angular.png", id: 1 },
    { name: "typescript", img: "https://cdn.worldvectorlogo.com/logos/typescript.svg", id: 2 },
    { name: "github", img: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg", id: 3 },
    { name: "js", img: "https://cdn.worldvectorlogo.com/logos/logo-javascript.svg", id: 4 },
    { name: "css3", img: "https://cdn.worldvectorlogo.com/logos/css-3.svg", id: 5 },
    { name: "html5", img: "https://cdn.worldvectorlogo.com/logos/html-1.svg", id: 6 }
  ];

  ngOnInit() {
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this._themeMemoryGame = theme;
      });

    this.startGame();
  }

  startGame() {
    this.moves = 0;
    this.showModal = false;
    this.lockBoard = false;
    this.flippedCards = [];
    // Duplicar e embaralhar
    this.cards = this.shuffle([...this.cardImages, ...this.cardImages].map(card => ({ ...card, matched: false, flipped: false })));
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
    if (first.id === second.id && first !== second) {
      first.matched = second.matched = true;
    } else {
      first.flipped = second.flipped = false;
    }
    this.flippedCards = [];
    this.lockBoard = false;
    if (this.cards.every(card => card.matched)) {
      setTimeout(() => this.showModal = true, 500);
    }
  }

  restart() {
    this.router.navigate(['/webmain/games'])
  }

  returnMenu(){
    this.router.navigate(['/webmain'])
  }
}
