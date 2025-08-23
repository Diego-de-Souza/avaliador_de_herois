import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-flash-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flash-loading.component.html',
  styleUrl: './flash-loading.component.css'
})
export class FlashLoadingComponent {
  private themeService = inject(ThemeService);
  
  @Input() isVisible: boolean = false;
  @Input() loadingText: string = 'CARREGANDO HERÓIS';
  @Input() subtitle: string = 'Aguarde enquanto o Flash busca os dados...';
  
  currentTheme: string = 'dark';
  particles: Array<{x: number, y: number, delay: number}> = [];

  constructor() {
    this.generateParticles();
    
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  private generateParticles(): void {
    this.particles = Array.from({length: 20}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
  }
}
