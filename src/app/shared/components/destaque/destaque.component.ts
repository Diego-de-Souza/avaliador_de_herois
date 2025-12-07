import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { DestaquesService } from '../../../core/service/destaques/destaques.service';
import { HighlightsProps } from '../../../core/interface/highlights.interface';

@Component({
  selector: 'app-destaque',
  standalone: true,
  imports: [],
  templateUrl: './destaque.component.html',
  styleUrl: './destaque.component.css'
})
export class DestaqueComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly destaqueService = inject(DestaquesService);
  public themeAll: string = 'dark';
  public destaques: HighlightsProps[] = [];

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.themeAll = theme;
      this.applyTheme(theme);
    });

    this.destaqueService.getDestaques().subscribe((resp) => {
      if (resp && Array.isArray(resp.data)) {
        this.destaques = resp.data.map((group: any) => ({
          label: group.label,
          items: group.items,
          image: group.image 
            || (group.label === 'Artigos' 
              ? '/img/home/destaques/features_articles.png' 
              : group.label === 'Eventos' 
                ? '/img/home/destaques/features_events.png' 
                : group.label === 'Games' 
                  ? '/img/home/destaques/features_games.png' 
                  : '/img/home/user/user_default.jpg'), 
          link: group.link  
        }));
      } else {
        this.destaques = [];
        console.error('Destaques não encontrados ou resposta inválida:', resp);
      }
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
