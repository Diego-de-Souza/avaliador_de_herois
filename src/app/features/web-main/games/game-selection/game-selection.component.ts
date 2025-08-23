import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-game-selection',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './game-selection.component.html',
  styleUrl: './game-selection.component.css'
})
export class GameSelectionComponent {
  games = [
    {
      title: 'Memory Game',
      description: 'Desafie sua memória com cartas geek!',
      icon: '🧠',
      route: 'memory-game'
    },
    // Adicione outros jogos aqui futuramente
  ];
}
