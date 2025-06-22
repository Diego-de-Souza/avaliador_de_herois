import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-destaque',
  standalone: true,
  imports: [],
  templateUrl: './destaque.component.html',
  styleUrl: './destaque.component.css'
})
export class DestaqueComponent implements OnInit {
  public themeAll: string = 'dark';

  destaques = [
    {
      imagem: '/img/events/user-icon.png',
      titulo: 'Homem-Aranha',
      descricao: 'Novo filme anunciado com multiverso expandido!',
      link: '#'
    },
    {
      imagem: '/img/events/user-icon.png',
      titulo: 'Homem de Ferro',
      descricao: 'Edição especial dos quadrinhos dos anos 90.',
      link: '#'
    },
    {
      imagem: '/img/events/user-icon.png',
      titulo: 'Star Wars',
      descricao: 'Nova série live-action no universo de Mandalorian.',
      link: '#'
    },
    {
      imagem: '/img/events/user-icon.png',
      titulo: 'Batman',
      descricao: 'Trailer incrível do novo jogo Arkham Legacy.',
      link: '#'
    }
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.themeAll = theme;
      this.applyTheme(theme);
    });
  }

  applyTheme(theme: string) {
    const el = document.getElementById('theme_destaques');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
