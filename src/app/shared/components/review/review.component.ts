import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit{
  public themeReview: string = 'dark';
  reviews = [
    {
      imagem: '/img/events/user-icon.png',
      titulo: 'Homem-Aranha: Através do Aranhaverso',
      descricao: 'Uma obra-prima da animação com visuais inovadores.',
      nota: 4.8,
      link: '#'
    },
    {
      imagem: '/img/events/user-icon.png',
      titulo: 'Homem de Ferro',
      descricao: 'O início épico do MCU, tecnológico e carismático.',
      nota: 4.5,
      link: '#'
    },
    {
      imagem: '/img/events/user-icon.png',
      titulo: 'Star Wars: Mandalorian',
      descricao: 'Série que redefiniu o universo Star Wars.',
      nota: 4.9,
      link: '#'
    },
    {
      imagem: '/img/events/user-icon.png',
      titulo: 'Batman: Arkham Legacy (Jogo)',
      descricao: 'Um jogo sombrio, intenso e perfeito para fãs do morcego.',
      nota: 4.7,
      link: '#'
    }
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void { 
    this.themeService.theme$.subscribe(theme => {
      this.themeReview = theme;
      this.applyTheme(theme);
    })
  }

  estrelasArray(nota: number): number[] {
    const fullStars = Math.floor(nota);
    const halfStar = nota % 1 >= 0.5 ? 0.5 : 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return [
      ...Array(fullStars).fill(1),
      ...(halfStar ? [0.5] : []),
      ...Array(emptyStars).fill(0)
    ];
  }

  applyTheme(theme: string) {
    const el = document.getElementById('theme_reviews');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
