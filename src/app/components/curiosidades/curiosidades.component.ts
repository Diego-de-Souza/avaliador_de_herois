import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-curiosidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curiosidades.component.html',
  styleUrls: ['./curiosidades.component.css'],
})
export class CuriosidadesComponent implements AfterViewInit {
  public curiosidades = [
    { texto: 'Sabia que o Hulk era cinza na sua primeira aparição nos quadrinhos?' },
    { texto: 'O Homem de Ferro foi criado em apenas 6 meses por Stan Lee.' },
    { texto: 'A palavra "Geek" originalmente significava "esquisito" no século 19!' },
  ];

  @ViewChild('curiosidadeLista') curiosidadeLista!: ElementRef;

  constructor(private renderer: Renderer2) {}

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
}
