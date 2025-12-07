import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-novidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novidades.component.html',
  styleUrl: './novidades.component.css'
})
export class NovidadesComponent implements OnInit {
  public themeNovidades: string = 'dark';

  bestGameScores = [
    { player: 'Alice', game: 'Space Invaders', score: 9800, image: '/img/home/user/user_default.jpg' },
    { player: 'Bob', game: 'Pac-Man', score: 8700, image: '/img/home/user/user_default.jpg' },
    { player: 'Charlie', game: 'Donkey Kong', score: 12500, image: '/img/home/user/user_default.jpg' },
    { player: 'Diana', game: 'Galaga', score: 8920, image: '/img/home/user/user_default.jpg' },
    { player: 'Ethan', game: 'Street Fighter II', score: 7450, image: '/img/home/user/user_default.jpg' },
    { player: 'Fiona', game: 'Tetris', score: 15680, image: '/img/home/user/user_default.jpg' },
    { player: 'George', game: 'Mortal Kombat', score: 6300, image: '/img/home/user/user_default.jpg' },
    { player: 'Helen', game: 'Defender', score: 10240, image: '/img/home/user/user_default.jpg' }
  ];

  newReleases = [
    { title: 'Super Geek Bros', releaseDate: new Date('2025-12-10') },
    { title: 'Hero Quest', releaseDate: new Date('2025-12-15') },
    { title: 'Cyberpunk 2078', releaseDate: new Date('2025-11-20') },
    { title: 'Stellar Odyssey', releaseDate: new Date('2025-12-05') },
    { title: 'Neon Racing X', releaseDate: new Date('2025-11-30') },
    { title: 'Mythic Realms', releaseDate: new Date('2026-01-15') },
    { title: 'Quantum Shift', releaseDate: new Date('2026-02-10') },
    { title: 'Solar Survivors', releaseDate: new Date('2025-12-25') }
  ];

  quizRanking = [
    { name: 'Carol', points: 120, image: '/img/home/user/user_default.jpg' },
    { name: 'Dave', points: 110, image: '/img/home/user/user_default.jpg' },
    { name: 'Emma', points: 145, image: '/img/home/user/user_default.jpg' },
    { name: 'Frank', points: 98, image: '/img/home/user/user_default.jpg' },
    { name: 'Grace', points: 167, image: '/img/home/user/user_default.jpg' },
    { name: 'Henry', points: 132, image: '/img/home/user/user_default.jpg' },
    { name: 'Irene', points: 155, image: '/img/home/user/user_default.jpg' },
    { name: 'Jack', points: 121, image: '/img/home/user/user_default.jpg' }
  ];

  @ViewChild('novidadesContainer', { static: true }) novidadesContainer!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private themeService: ThemeService,
  ) { }

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.themeNovidades = theme;
      this.applyTheme(theme);
    });
  }

  private applyTheme(theme: string): void {
    const el = this.novidadesContainer.nativeElement;
    if (!el) return;

    if (theme === 'dark') {
      this.renderer.removeClass(el, 'light');
      this.renderer.addClass(el, 'dark');
    } else {
      this.renderer.removeClass(el, 'dark');
      this.renderer.addClass(el, 'light');
    }
  }
}