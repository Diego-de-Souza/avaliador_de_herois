import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit{
  reviews = [
    {
      imagem: '/assets/img/spider.jpg',
      titulo: 'Homem-Aranha: Através do Aranhaverso',
      descricao: 'Uma obra-prima da animação com visuais inovadores.',
      nota: 4.8,
      link: '#'
    },
    {
      imagem: '/assets/img/ironman.jpg',
      titulo: 'Homem de Ferro',
      descricao: 'O início épico do MCU, tecnológico e carismático.',
      nota: 4.5,
      link: '#'
    },
    {
      imagem: '/assets/img/starwars.jpg',
      titulo: 'Star Wars: Mandalorian',
      descricao: 'Série que redefiniu o universo Star Wars.',
      nota: 4.9,
      link: '#'
    },
    {
      imagem: '/assets/img/batman.jpg',
      titulo: 'Batman: Arkham Legacy (Jogo)',
      descricao: 'Um jogo sombrio, intenso e perfeito para fãs do morcego.',
      nota: 4.7,
      link: '#'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

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
}
