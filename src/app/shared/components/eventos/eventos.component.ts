import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css',
})
export class EventosComponent implements OnInit {
  public themeEventos: string = 'dark';
  eventos = [
    {
      imagem: '/assets/img/evento-comiccon.jpg',
      titulo: 'Comic Con Experience 2025',
      data: '03 a 06 de Dezembro',
      local: 'São Paulo - SP',
      descricao: 'O maior evento geek da América Latina, com painéis, lançamentos e muitas surpresas!',
      link: '#',
    },
    {
      imagem: '/assets/img/evento-anime.jpg',
      titulo: 'Anime Friends',
      data: '20 a 23 de Julho',
      local: 'São Paulo - SP',
      descricao: 'Evento imperdível para os fãs de anime, mangá e cultura japonesa.',
      link: '#',
    },
    {
      imagem: '/assets/img/evento-game.jpg',
      titulo: 'Brasil Game Show',
      data: '09 a 13 de Outubro',
      local: 'São Paulo - SP',
      descricao: 'Maior feira de games da América Latina, com jogos, campeonatos e convidados especiais.',
      link: '#',
    },
    {
      imagem: '/assets/img/evento-starwars.jpg',
      titulo: 'Star Wars Fan Fest',
      data: '15 de Agosto',
      local: 'Rio de Janeiro - RJ',
      descricao: 'Encontro épico para os fãs de Star Wars, com cosplays, workshops e mais.',
      link: '#',
    },
    {
      imagem: '/assets/img/evento-harrypotter.jpg',
      titulo: 'Harry Potter Expo',
      data: '10 de Setembro',
      local: 'Curitiba - PR',
      descricao: 'Explore o mundo mágico com cenários, figurinos e atividades interativas.',
      link: '#',
    },
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.themeEventos = theme;
      this.applyTheme(theme);
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
