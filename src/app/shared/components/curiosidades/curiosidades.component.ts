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
    { texto: 'Batman quase usava um traje vermelho e amarelo em sua primeira aparição!' },
    { texto: 'O sabre de luz de Darth Vader faz um som diferente dos outros Sith' },
    { texto: 'O nome original do Homem-Aranha seria "Homem-Mosca"' },
  ];
  public themeCuriosidades: string = 'dark';

  @ViewChild('curiosidadesContainer', { static: true }) curiosidadesContainer!: ElementRef;

  constructor(private renderer: Renderer2, private themeService: ThemeService) {}

  ngAfterViewInit(): void {
    this.setupAnimations();
  }

  private setupAnimations(): void {
    const timeline = this.curiosidadesContainer.nativeElement.querySelector('.timeline-circuit');
    if (!timeline) {
      console.warn('Elemento timeline-circuit não encontrado');
      return;
    }
    const nodes = timeline.querySelectorAll('.timeline-node');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    nodes.forEach((node: HTMLElement) => {
      observer.observe(node);
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.themeCuriosidades = theme;
      this.applyTheme(theme);
    });
  }

  private applyTheme(theme: string): void {
    const el = this.curiosidadesContainer.nativeElement;
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