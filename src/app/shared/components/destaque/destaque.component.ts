import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-destaque',
  standalone: true,
  imports: [],
  templateUrl: './destaque.component.html',
  styleUrl: './destaque.component.css'
})
export class DestaqueComponent implements OnInit{
  destaques = [
    {
      imagem: '/assets/img/spider.jpg',
      titulo: 'Homem-Aranha',
      descricao: 'Novo filme anunciado com multiverso expandido!',
      link: '#'
    },
    {
      imagem: '/assets/img/ironman.jpg',
      titulo: 'Homem de Ferro',
      descricao: 'Edição especial dos quadrinhos dos anos 90.',
      link: '#'
    },
    {
      imagem: '/assets/img/starwars.jpg',
      titulo: 'Star Wars',
      descricao: 'Nova série live-action no universo de Mandalorian.',
      link: '#'
    },
    {
      imagem: '/assets/img/batman.jpg',
      titulo: 'Batman',
      descricao: 'Trailer incrível do novo jogo Arkham Legacy.',
      link: '#'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
