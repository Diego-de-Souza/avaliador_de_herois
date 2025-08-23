import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent implements OnInit{
  private readonly themeService: ThemeService = inject(ThemeService);

  public _themeService = 'dark';
  public email = '';
  public subscribed = false;
  public newsList = [
    {
      title: 'Novo filme dos Vingadores anunciado!',
      description: 'Marvel Studios confirma produção de um novo filme dos Vingadores com estreia prevista para 2026.',
      image: 'assets/img/Capitao_América_cover.png',
      link: 'https://www.marvel.com/movies/avengers'
    },
    {
      title: 'HQ do Deadpool bate recorde de vendas',
      description: 'A última edição da HQ do Deadpool se tornou a mais vendida do ano entre os fãs geeks.',
      image: 'assets/img/deadpool_cover.png',
      link: 'https://www.marvel.com/comics/deadpool'
    },
    {
      title: 'Nova série da Capitã Marvel chega ao streaming',
      description: 'A série solo da Capitã Marvel estreia com grande sucesso e críticas positivas.',
      image: 'assets/img/Capitã_Marvel_cover.png',
      link: 'https://www.marvel.com/tv-shows/captain-marvel'
    }
    // Adicione mais notícias conforme necessário
  ];

  ngOnInit() {
    this.themeService.theme$.subscribe(theme =>{
      this._themeService = theme;
    })
  }

  subscribe() {
    if (this.email) {
      this.subscribed = true;
      // Aqui você pode adicionar lógica para enviar o email para o backend
    }
  }
}
