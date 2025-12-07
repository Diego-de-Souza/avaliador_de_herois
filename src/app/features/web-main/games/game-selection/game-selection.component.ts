import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../core/service/theme/theme.service';

@Component({
  selector: 'app-game-selection',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './game-selection.component.html',
  styleUrl: './game-selection.component.css'
})
export class GameSelectionComponent implements OnInit {
  private readonly themeService = inject(ThemeService);

  public _themeService = 'dark';
  games = [
    {
      title: 'Memory Game',
      description: 'Desafie sua memória com cartas geek!',
      icon: '🧠',
      link: '/webmain/games/memory-game'
    },
    {
      title: 'Hero Battle',
      description: 'Monte seu time de heróis e desafie outros jogadores!',
      icon: '⚔️',
      link: '/webmain/games/hero-battle'
    }
  ];

  ngOnInit() {
    this.themeService.theme$.subscribe(theme =>{
      this._themeService = theme;
    })
  }
}
