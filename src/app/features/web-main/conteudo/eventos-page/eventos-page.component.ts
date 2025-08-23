import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-eventos-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './eventos-page.component.html',
  styleUrl: './eventos-page.component.css'
})
export class EventosPageComponent implements OnInit{
  private readonly themeService: ThemeService = inject(ThemeService);

  public _themeService = 'dark';

  eventos = [
    {
      title: 'Comic Con Experience',
      date: '10-13 Dez 2025',
      location: 'São Paulo Expo',
      image: 'assets/img/comic_con.jpg',
      description: 'O maior evento geek da América Latina, com convidados internacionais, painéis, estandes e experiências únicas.'
    },
    {
      title: 'Anime Friends',
      date: '20-22 Jul 2025',
      location: 'Anhembi',
      image: 'assets/img/anime_friends.jpg',
      description: 'Festival de cultura pop oriental, com shows, concursos, workshops e área de games.'
    },
    {
      title: 'Marvel Day',
      date: '15 Ago 2025',
      location: 'Online',
      image: 'assets/img/marvel_day.jpg',
      description: 'Evento digital com novidades, trailers, entrevistas e sorteios para fãs da Marvel.'
    }
    // Adicione mais eventos conforme necessário
  ];

  ngOnInit() {
    this.themeService.theme$.subscribe(theme =>{
      this._themeService = theme;
    })
  }

}
