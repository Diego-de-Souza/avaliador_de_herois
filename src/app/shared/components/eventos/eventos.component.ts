import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { EventosService } from '../../../core/service/events/eventos.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css',
})
export class EventosComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly eventosService = inject(EventosService);
  activeIndex = 0;
  public eventos: any[] = [];

  setActive(index: number) {
    this.activeIndex = index;
  }

  getIcon(index: number): string {
    const icons = [
      'fas fa-walking',
      'fas fa-snowflake',
      'fas fa-tree',
      'fas fa-tint',
      'fas fa-sun'
    ];
    return icons[index % icons.length];
  }
  public themeEventos: string = 'dark';
  
  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.themeEventos = theme;
      this.applyTheme(theme);
    });

    this.getEventos();
  }

  getEventos() {
    this.eventosService.getEventos().subscribe((resp) => {
      if (resp.data && resp.data.length > 0) {
        this.eventos = resp.data;
      }
    });
  }

  applyTheme(theme: string) {
    const el = document.getElementById('theme_eventos');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
