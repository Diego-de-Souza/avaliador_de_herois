import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, Renderer2, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-curiosidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curiosidades.component.html',
  styleUrls: ['./curiosidades.component.css'],
})
export class CuriosidadesComponent implements AfterViewInit, OnInit {
  public curiosidades = [
    { texto: 'Sabia que o Hulk era cinza na sua primeira aparição nos quadrinhos?' },
    { texto: 'O Homem de Ferro foi criado em apenas 6 meses por Stan Lee.' },
    { texto: 'A palavra "Geek" originalmente significava "esquisito" no século 19!' },
    { texto: 'A palavra "Geek" originalmente significava "esquisito" no século 19!' },
    { texto: 'A palavra "Geek" originalmente significava "esquisito" no século 19!' },
    { texto: 'A palavra "Geek" originalmente significava "esquisito" no século 19!' },
  ];
  public themeCuriosidades: string | null = 'dark';

  @ViewChild('curiosidadeLista') curiosidadeLista!: ElementRef;

  constructor(private renderer: Renderer2, private themeService: ThemeService) {}

  ngAfterViewInit(): void {
    const items = this.curiosidadeLista.nativeElement.querySelectorAll('.curiosidade-item');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'animate');
            observer.unobserve(entry.target); // Evita re-executar a animação
          }
        });
      },
      { threshold: 0.1 } // Ativa com 10% do elemento visível
    );

    items.forEach((item: HTMLElement) => {
      observer.observe(item);
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.themeCuriosidades = theme;
      this.applyTheme(theme);
    });
  }

  applyTheme(theme: string) {
    const el = document.getElementById('theme_curiosidades');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
  
}
