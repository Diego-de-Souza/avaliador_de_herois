import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../core/service/theme/theme.service';

@Component({
  selector: 'app-destaques-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './destaques-page.component.html',
  styleUrl: './destaques-page.component.css'
})
export class DestaquesPageComponent implements OnInit{
  private readonly themeService: ThemeService = inject(ThemeService);

  public _themeHighlight: string = 'dark';

  highlights = [
    {
      name: 'Adam Warlock',
      image: 'assets/img/Adam_Warlock_cover.png',
      description: 'Um dos heróis cósmicos mais poderosos do universo Marvel.'
    },
    {
      name: 'Deadpool',
      image: 'assets/img/deadpool_cover.png',
      description: 'O mercenário tagarela favorito dos geeks.'
    },
    {
      name: 'Capitã Marvel',
      image: 'assets/img/Capitã_Marvel_cover.png',
      description: 'Heroína intergaláctica com poderes incríveis.'
    },
    // Adicione mais destaques conforme necessário
  ];

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme =>{
      this._themeHighlight = theme;
    })
  }
}
